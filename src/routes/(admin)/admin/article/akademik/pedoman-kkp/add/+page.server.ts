import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createPedomanKkp } from '$lib/repository/admin/article/akedemik/pedomanKKP';
import { randomUUID } from '$lib/crypto';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { PedomanKkpFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe PedomanKkpFormValues
		const values: PedomanKkpFormValues = {
			title: formData.get('title')?.toString().trim() || '',
			imageUrl:
				formData.get('image_url')?.toString().trim() ||
				formData.get('imageUrl')?.toString().trim() ||
				null,
			imageId:
				formData.get('public_id')?.toString().trim() ||
				formData.get('image_id')?.toString().trim() ||
				null,
			description: formData.get('description')?.toString().trim() || null
		};

		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul Pedoman KKP wajib diisi.', 'warning'),
				values
			});
		}

		if (values.title.length > 255) {
			return fail(400, {
				...warningResponse('Judul Pedoman KKP terlalu panjang, maksimal 255 karakter.', 'warning'),
				values
			});
		}

		const id = randomUUID();

		try {
			const success = await createPedomanKkp(
				id,
				values.title,
				values.imageUrl,
				values.description,
				values.imageId
			);

			if (!success) {
				return fail(500, {
					...warningResponse('Gagal menyimpan data Pedoman KKP ke database.', 'warning'),
					values
				});
			}
		} catch (error: any) {
			console.error('Error creating Pedoman KKP:', error);
			return fail(500, {
				...warningResponse(
					'Terjadi kesalahan sistem: ' + (error.message || 'Gagal menyimpan data'),
					'warning'
				),
				values
			});
		}

		return {
			...successResponse('Berhasil menambah Pedoman KKP', 'Success')
		};
	}, // untuk edit dia akan memanggil fungsi delete Photo saat tombol batal di click
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
