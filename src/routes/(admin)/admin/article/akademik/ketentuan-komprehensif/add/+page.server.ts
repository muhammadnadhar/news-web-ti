import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createRecruitment } from '$lib/repository/admin/article/akedemik/ketentuan-komprehensif';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { KetentuanKomprehensifFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		//  Ekstraksi data input ke objek values bertipe KetentuanKomprehensifFormValues
		const values: KetentuanKomprehensifFormValues = {
			title: formData.get('title')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			publicId: formData.get('public_id')?.toString().trim() || null,
			description: formData.get('description')?.toString().trim() || null
		};

		console.info('Public ID yang diterima:', values.publicId);

		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul Ketentuan Komprehensif wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (values.title.length > 255) {
			return fail(400, {
				...warningResponse('Judul terlalu panjang, maksimal 255 karakter.', 'Validasi Gagal'),
				values
			});
		}

		const id = randomUUID();

		try {
			const success = await createRecruitment(
				id,
				values.title,
				values.image_url,
				values.description,
				values.publicId
			);

			if (!success) {
				return fail(500, {
					...errorResponse(
						'Gagal menyimpan data Ketentuan Komprehensif ke database.',
						'Gagal Menyimpan'
					),
					values
				});
			}

			return successResponse('Data Ketentuan Komprehensif berhasil ditambahkan!', 'Berhasil');
		} catch (error: any) {
			console.error('Error creating Ketentuan Komprehensif:', error);
			return fail(500, {
				...errorResponse(
					`Terjadi kesalahan sistem: ${error.message || 'Kesalahan tidak diketahui'}`,
					'Kesalahan Sistem'
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
