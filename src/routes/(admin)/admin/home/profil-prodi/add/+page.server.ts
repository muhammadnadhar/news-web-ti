import type { ImageItem } from '$lib/dto/admin/home';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import { errorResponse, successResponse } from '$lib/helper/message';
import { addProfilProdi } from '$lib/repository/admin/home/profilProdi';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title')?.toString().trim();
		const description = formData.get('description')?.toString().trim() || '';
		const display_instruction =
			formData.get('display_instruction')?.toString().trim() || 'FLEX_CENTER';
		const imagesRaw = formData.get('images')?.toString() || '[]';

		// Parse array images dari JSON string
		let images: ImageItem[] = [];
		try {
			images = JSON.parse(imagesRaw);
		} catch (e) {
			images = [];
		}

		// Validasi input wajib
		if (!title) {
			return fail(400, {
				status: 'error',
				title: 'Gagal Simpan',
				message: 'Judul profil prodi wajib diisi.',
				values: { title, description, display_instruction, images: imagesRaw }
			});
		}

		try {
			await addProfilProdi({
				title,
				description,
				display_instruction,
				images
			});

			return {
				status: 'success',
				title: 'Berhasil',
				message: 'Profil prodi berhasil ditambahkan.'
			};
		} catch (err) {
			console.error('Error addProfilProdi:', err);
			return fail(500, {
				status: 'error',
				title: 'Gagal',
				message: 'Terjadi kesalahan server saat menambahkan profil prodi.',
				values: { title, description, display_instruction, images: imagesRaw }
			});
		}
	},

	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		console.info('deleted', publicId);

		if (!publicId) {
			return fail(400, errorResponse('Public Id tidak di temukan', 'Error'));
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
