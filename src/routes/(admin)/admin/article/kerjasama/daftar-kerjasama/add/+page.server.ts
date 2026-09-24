import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from '$lib/crypto';
import { createPartnership } from '$lib/repository/admin/article/kerjasama/daftar';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { cloudinary } from '$lib/cloudinary/server';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const institutionName = formData.get('institution_name')?.toString().trim();
		const logoUrl = formData.get('logo_url')?.toString().trim() || null;

		if (!institutionName) {
			return fail(400, {
				...warningResponse('Harap isi Nama Instansi / Mitra Kerjasama.', 'Gagal'),
				values: { institutionName, logoUrl }
			});
		}

		const id = randomUUID();

		try {
			await createPartnership(id, institutionName, logoUrl);
		} catch (err) {
			console.error('Error creating partnership:', err);

			return fail(500, {
				...errorResponse('Gagal menyimpan data Kerjasama ke database.', 'Gagal'),
				values: { institutionName, logoUrl }
			});
		}

		// throw redirect(303, '/admin/kerjasama');
		return successResponse('Data Mitra Kerjasama berhasil disimpan!', 'Berhasil');
	},
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		if (!publicId) {
			return fail(400, { ...errorResponse('Public Id tidak di temukan', 'Error') });
		}

		try {
			await cloudinary.uploader.destroy(publicId);
			return successResponse('Berhasil di batalkan', 'Succcess');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto ', 'Gagal'));
		}
	}
};
