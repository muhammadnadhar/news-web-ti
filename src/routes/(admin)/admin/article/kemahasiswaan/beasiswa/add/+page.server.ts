import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createScholarship } from '$lib/repository/admin/article/kemahasiswaan/beasiswa';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { BeasiswaFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const values: BeasiswaFormValues = {
			student_name: formData.get('student_name')?.toString().trim() || '',
			scholarship_name: formData.get('scholarship_name')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			image_public_id:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null
		};

		if (!values.student_name) {
			return fail(400, {
				...warningResponse('Nama Mahasiswa wajib diisi.', 'Warning'),
				values
			});
		}

		if (!values.image_url) {
			return fail(400, {
				...warningResponse('Foto wajib diisi.', 'Image Warning'),
				values
			});
		}

		if (!values.scholarship_name) {
			return fail(400, {
				...warningResponse('Nama Beasiswa wajib diisi.', 'Gagal'),
				values
			});
		}

		if (values.student_name.length > 255 || values.scholarship_name.length > 255) {
			return fail(400, {
				...warningResponse(
					'Nama mahasiswa atau nama beasiswa terlalu panjang (maksimal 255 karakter).',
					'Validasi Gagal'
				),
				values
			});
		}

		const id = randomUUID();

		try {
			const success = await createScholarship(
				id,
				values.student_name,
				values.scholarship_name,
				values.image_url,
				values.image_public_id
			);

			if (!success) {
				return fail(422, {
					...errorResponse('Gagal menyimpan data Penerima Beasiswa ke database.', 'Gagal'),
					values
				});
			}
		} catch (error: any) {
			console.error('Error creating scholarship:', error);
			return fail(500, {
				...errorResponse(
					'Terjadi Kesalahan pada System: ' + (error?.message || 'Error tidak diketahui'),
					'Error'
				),
				values
			});
		}

		// Redirect ke halaman daftar Beasiswa Kemahasiswaan
		// throw redirect(303, '/admin/kemahasiswaan/beasiswa');
		return {
			...successResponse('Berhasil menyimpan data mahasiswa Baru', 'Success'),
			values
		};
	},

	// untuk edit dia akan memanggil fungsi delete Photo saat tombol batal di click
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
