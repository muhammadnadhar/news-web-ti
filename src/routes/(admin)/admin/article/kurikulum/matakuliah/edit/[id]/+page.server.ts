import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getCourseMapById,
	updateCourseMap
} from '$lib/repository/admin/article/kurikulum/petaMatakuliah';
import { deleteCloudinaryImage } from '$lib/helper/cloudinary';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';

/**
 * Load function untuk mengambil data Peta Mata Kuliah berdasarkan ID dari URL
 */
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	//  Validasi ID tidak ada
	if (!id) {
		return {
			courseMap: null,
			...warningResponse('ID Peta Mata Kuliah tidak valid.', 'Validasi Gagal')
		};
	}

	try {
		const courseMap = await getCourseMapById(id);

		//  Validasi data tidak ditemukan
		if (!courseMap) {
			return {
				courseMap: null,
				...errorResponse('Data Peta Mata Kuliah tidak ditemukan.', 'Tidak Ditemukan')
			};
		}

		// Return sukses data map
		return {
			courseMap
		};
	} catch (err) {
		console.error('Error loading course map:', err);

		// Return error sistem server
		return {
			courseMap: null,
			...errorResponse(
				'Terjadi kesalahan saat mengambil data Peta Mata Kuliah.',
				'Kesalahan Sistem'
			)
		};
	}
};

/**
 * Form Actions untuk menangani submit form pembaharuan data (POST)
 */
export const actions: Actions = {
	update: async ({ request, params }) => {
		const id = params.id;

		// 1. Validasi Parameter ID
		if (!id) {
			return fail(400, errorResponse('ID Peta Mata Kuliah tidak ditemukan di URL.', 'Gagal'));
		}

		// Ambil data dari FormData
		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const imageUrl = formData.get('image_url')?.toString().trim() || null;

		//  Validasi Form Input
		if (!title) {
			return fail(400, errorResponse('Judul Peta Mata Kuliah wajib diisi.', 'Validasi Gagal'));
		}

		if (!imageUrl) {
			return fail(400, errorResponse('Gambar Peta Mata Kuliah wajib diunggah.', 'Validasi Gagal'));
		}

		try {
			// Jalankan query update database
			const isUpdated = await updateCourseMap(id, title, imageUrl);

			if (!isUpdated) {
				return fail(
					400,
					errorResponse('Data gagal diperbarui atau tidak ada perubahan data.', 'Gagal Menyimpan')
				);
			}

			//  Success Response
			return successResponse('Data Peta Mata Kuliah berhasil diperbarui.', 'Berhasil');
		} catch (err) {
			console.error('Error updating course map:', err);

			//Error Response Sistem
			return fail(
				500,
				errorResponse('Terjadi kesalahan pada sistem saat memperbarui data.', 'Kesalahan Server')
			);
		}
	},

	/**
	 * Action: Hapus Gambar Cloudinary & Kosongkan/Reset di Database
	 * Update bsia saja terpisah karena bsia saja orang hanya mengahspus gambar
	 */
	deleteImage: async ({ request, params }) => {
		const id = params.id;

		// 1. Validasi ID Parameter
		if (!id) {
			return fail(400, errorResponse('ID tidak ditemukan.', 'Gagal'));
		}

		const formData = await request.formData();
		const imageUrl = formData.get('image_url')?.toString().trim();

		// 2. Validasi URL Gambar
		if (!imageUrl) {
			return fail(400, errorResponse('URL gambar tidak ditemukan untuk dihapus.', 'Gagal'));
		}

		try {
			await deleteCloudinaryImage(imageUrl);

			// Update database (set image_url menjadi null)
			const courseMap = await getCourseMapById(id);
			if (courseMap) {
				await updateCourseMap(id, courseMap.title, null);
			}

			// Success Response
			return successResponse('Gambar berhasil dihapus dari Cloudinary.', 'Berhasil');
		} catch (err) {
			console.error('Error deleting image:', err);

			//  Error Response Sistem
			return fail(500, errorResponse('Gagal menghapus gambar dari server.', 'Kesalahan Server'));
		}
	}
};
