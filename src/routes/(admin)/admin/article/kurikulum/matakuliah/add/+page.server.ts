import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import {
	createCourseMap,
} from '$lib/repository/admin/article/kurikulum/petaMatakuliah';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import {  deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { CourseMapFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe CourseMapFormValues
		const values: CourseMapFormValues = {
			title: formData.get('title')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			image_public_id:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null
		};
		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul Peta Mata Kuliah wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (!values.image_url) {
			return fail(400, {
				...warningResponse('Foto/Gambar Peta Mata Kuliah wajib diunggah.', 'Validasi Gagal'),
				values
			});
		}

		const id = randomUUID();

		try {
			const success = await createCourseMap(
				id,
				values.title,
				values.image_url,
				values.image_public_id
			);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data Peta Mata Kuliah ke database.', 'Gagal Menyimpan'),
					values
				});
			}
		} catch (error: any) {
			console.error('Error creating course map:', error);
			return fail(500, {
				...errorResponse(
					'Terjadi kesalahan sistem: ' + (error?.message || 'Gagal menyimpan data'),
					'Kesalahan Sistem'
				),
				values
			});
		}

		return successResponse('Data Peta Mata Kuliah berhasil disimpan!', 'Berhasil');
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
