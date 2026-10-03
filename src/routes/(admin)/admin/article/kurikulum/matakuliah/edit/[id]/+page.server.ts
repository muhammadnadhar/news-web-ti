import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getCourseMapById,
	updateCourseMap
} from '$lib/repository/admin/article/kurikulum/petaMatakuliah';
import { deleteCloudinaryImage, deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import type { CourseMapFormValues } from '$lib/types/values/admin/article';

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
		const formData = await request.formData();

		const values: CourseMapFormValues = {
			id,
			title: formData.get('title')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			image_public_id:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null
		};

		if (!id) {
			return fail(400, {
				...errorResponse('ID Peta Mata Kuliah tidak ditemukan di URL.', 'Gagal'),
				values
			});
		}

		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul Peta Mata Kuliah wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (!values.image_url) {
			return fail(400, {
				...warningResponse('Gambar Peta Mata Kuliah wajib diunggah.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const isUpdated = await updateCourseMap(
				id,
				values.title,
				values.image_url,
				values.image_public_id
			);

			if (!isUpdated) {
				return fail(400, {
					...errorResponse(
						'Data gagal diperbarui atau tidak ada perubahan data.',
						'Gagal Menyimpan'
					),
					values
				});
			}

			// Success Response
			return successResponse('Data Peta Mata Kuliah berhasil diperbarui.', 'Berhasil');
		} catch (err) {
			console.error('Error updating course map:', err);

			// Error Response Sistem
			return fail(500, {
				...errorResponse(
					'Terjadi kesalahan pada sistem saat memperbarui data.',
					'Kesalahan Server'
				),
				values
			});
		}
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
