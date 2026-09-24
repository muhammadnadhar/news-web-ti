import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createPedomanTa } from '$lib/repository/admin/article/akedemik/pedomanTa';
import { errorResponse, successResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import { cloudinary } from '$lib/cloudinary/server';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const imageUrl = (formData.get('image_url') as string) || null;
		const description = (formData.get('description') as string) || null;

		// Validasi input wajib
		if (!title || title.trim() === '') {
			return fail(400, {
				success: false,
				message: 'Judul Pedoman TA wajib diisi.',
				values: { title, imageUrl, description }
			});
		}

		// Generate UUID unik untuk Primary Key
		const id = randomUUID();

		try {
			const success = await createPedomanTa(id, title, imageUrl, description);

			if (!success) {
				return fail(500, {
					success: false,
					message: 'Gagal menyimpan data Pedoman TA ke database.',
					values: { title, imageUrl, description }
				});
			}
		} catch (error: any) {
			return fail(500, {
				success: false,
				message: 'Terjadi kesalahan sistem: ' + error.message,
				values: { title, imageUrl, description }
			});
		}

		// Redirect kembali ke halaman daftar setelah berhasil
		// throw redirect(303, '/admin/akademik/pedoman-ta');
		return successResponse('Pedoman TA berhasil disimpan.', 'Berhasil');
	},
	// url action untuk Gambar yang di batalin akan mengguanka url ini , karena
	// cloudinary akan meng upload duluan ke cloud nya
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		if (!publicId) {
			return fail(400, errorResponse('Public Id tidak di temukan', 'Error'));
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
