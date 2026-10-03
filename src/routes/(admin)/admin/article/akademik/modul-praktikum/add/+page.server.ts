import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createPracticumModule } from '$lib/repository/admin/article/akedemik/modulePratikum';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import { randomUUID } from '$lib/crypto';
import type { ModulPraktikumFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		// Ekstraksi data input ke objek values bertipe ModulPraktikumFormValues
		const values: ModulPraktikumFormValues = {
			title: formData.get('title')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			image_public_id: formData.get('image_public_id')?.toString().trim() || null,
			description: formData.get('description')?.toString().trim() || null
		};

		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul Modul Praktikum wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (values.title.length > 255) {
			return fail(400, {
				...warningResponse(
					'Judul Modul Praktikum terlalu panjang, maksimal 255 karakter.',
					'Validasi Gagal'
				),
				values
			});
		}

		const id = randomUUID();

		try {
			const success = await createPracticumModule(
				id,
				values.title,
				values.image_url,
				values.description,
				values.image_public_id
			);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data modul Praktikum.', 'Gagal Menyimpan'),
					values
				});
			}
		} catch (error: any) {
			console.error('Error creating Practicum Module:', error);
			return fail(500, {
				...errorResponse(
					`Terjadi kesalahan sistem: ${error.message || 'Kesalahan tidak diketahui'}`,
					'Kesalahan Sistem'
				),
				values
			});
		}

		// Redirect ke halaman daftar Modul Praktikum
		// throw redirect(303, '/admin/akademik/modul-praktikum');
		return successResponse('Berhasil membuat modul Praktikum', 'Berhasil');
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
