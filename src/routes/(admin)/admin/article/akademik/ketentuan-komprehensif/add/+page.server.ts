import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createRecruitment } from '$lib/repository/admin/article/akedemik/ketentuan-komprehensif';
import { errorResponse, successResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import { cloudinary } from '$lib/cloudinary/server';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const imageUrl = (formData.get('image_url') as string) || null;
		const description = (formData.get('description') as string) || null;
		const public_id = (formData.get('public_id') as string) || null;

    console.info("id yg di dapat  :",public_id);

		// Validasi input wajib
		if (!title || title.trim() === '') {
			return fail(400, {
				...errorResponse('Judul Rekrutmen wajib diisi.', 'Validasi Gagal', {
					title: ['Judul Rekrutmen wajib diisi.']
				}),
				values: { title, imageUrl, description }
			});
		}

		const id = randomUUID();

		try {
			const success = await createRecruitment(id, title, imageUrl, description,public_id);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data Rekrutmen Asisten ke database.'),
					values: { title, imageUrl, description }
				});
			}
		} catch (error: any) {
			return fail(500, {
				...errorResponse(`Terjadi kesalahan sistem: ${error.message}`),
				values: { title, imageUrl, description }
			});
		}

		// Redirect ke halaman daftar Rekrutmen Asisten
		// throw redirect(303, '/admin/akademik/rekrutmen-asisten');
		return successResponse('Data Rekrutmen Asisten berhasil ditambahkan!');
	},
	deleteImage: async ({ request }) => {
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
