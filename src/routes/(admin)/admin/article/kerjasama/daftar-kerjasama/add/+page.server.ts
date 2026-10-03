import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from '$lib/crypto';
import { createPartnership } from '$lib/repository/admin/article/kerjasama/daftar';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { KerjasamaFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const values: KerjasamaFormValues = {
			institution_name: formData.get('institution_name')?.toString().trim() || '',
			logo_url: formData.get('logo_url')?.toString().trim() || null,
			logo_public_id:
				formData.get('logo_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null
		};

		if (!values.institution_name) {
			return fail(400, {
				...warningResponse('Harap isi Nama Instansi / Mitra Kerjasama.', 'Gagal'),
				values
			});
		}

		const id = randomUUID();

		try {
			await createPartnership(id, values.institution_name, values.logo_url, values.logo_public_id);
		} catch (err) {
			console.error('Error creating partnership:', err);

			return fail(500, {
				...errorResponse('Gagal menyimpan data Kerjasama ke database.', 'Gagal'),
				values
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
			await deleteImageFromCloudinary(publicId);
			return successResponse('Berhasil di batalkan', 'Succcess');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto ', 'Gagal'));
		}
	}
};
