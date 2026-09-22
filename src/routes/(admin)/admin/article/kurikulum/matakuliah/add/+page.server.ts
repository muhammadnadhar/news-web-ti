import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import {
	createCourseMap,
	getCourseMapById,
	updateCourseMap
} from '$lib/repository/admin/article/kurikulum/petaMatakuliah';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import { deleteCloudinaryImage } from '$lib/helper/cloudinary';

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const imageUrl = formData.get('image_url') as string;

		// Validasi input wajib: Judul
		if (!title || title.trim() === '') {
			return fail(400, {
				success: false,
				message: 'Judul Peta Mata Kuliah wajib diisi.',
				values: { title, imageUrl }
			});
		}

		// Validasi input wajib: Gambar (karena kolom DB NOT NULL)
		if (!imageUrl || imageUrl.trim() === '') {
			return fail(400, {
				success: false,
				message: 'Foto/Gambar Peta Mata Kuliah wajib diunggah.',
				values: { title, imageUrl }
			});
		}

		// Generate UUID unik untuk Primary Key
		const id = randomUUID();

		try {
			const success = await createCourseMap(id, title, imageUrl);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data Peta Mata Kuliah.', 'Gagal Menyimpan'),
					values: { title, imageUrl }
				});
			}
		} catch (error: any) {
			return fail(500, {
				...errorResponse('Terjadi kesalahan sistem: ' + error.message, 'Kesalahan Sistem'),
				values: { title, imageUrl }
			});
		}
		// Redirect ke halaman daftar Peta Mata Kuliah
		// throw redirect(303, '/admin/akademik/peta-matakuliah')
		return successResponse('Berhasil menyimpan Data Mata Kuliah', 'Success');
	},

	/**
	 * Action: Hapus Gambar Cloudinary & Kosongkan/Reset di Database
	 * Update bsia saja terpisah karena bsia saja orang hanya mengahspus gambar
	 */
	deleteImage: async ({ request, params }) => {
		const id = params.id;

		// 1. Validasi ID Parameter
		if (!id) {
			return fail(400, warningResponse('ID tidak ditemukan.', 'Gagal'));
		}

		const formData = await request.formData();
		const imageUrl = formData.get('image_url')?.toString().trim();

		// 2. Validasi URL Gambar
		if (!imageUrl) {
			return fail(400, warningResponse('URL gambar tidak ditemukan untuk dihapus.', 'Gagal'));
		}

		try {
			await deleteCloudinaryImage(imageUrl);

			// Update database (set image_url menjadi null)
			const courseMap = await getCourseMapById(id);
			if (courseMap) {
				await updateCourseMap(id, courseMap.title, null);
			}

			//  Success Response
			return successResponse('Gambar berhasil dihapus dari Cloudinary.', 'Berhasil');
		} catch (err) {
			console.error('Error deleting image:', err);

			return fail(500, errorResponse('Gagal menghapus gambar dari server.', 'Kesalahan Server'));
		}
	}
};
