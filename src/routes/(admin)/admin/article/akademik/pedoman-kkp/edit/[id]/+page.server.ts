import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getPedomanKkpById,
	updatePedomanKkp
} from '$lib/repository/admin/article/akedemik/pedomanKKP';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { PedomanKkpFormValues } from '$lib/types/values/admin/article';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID Pedoman KKP tidak valid');
	}

	const pedomanKkp = await getPedomanKkpById(id);

	if (!pedomanKkp) {
		throw error(404, 'Data Pedoman KKP tidak ditemukan');
	}

	return {
		pedomanKkp
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const id = params.id || formData.get('id')?.toString();

		const values: PedomanKkpFormValues = {
			title: formData.get('title')?.toString().trim() || '',
			image_url:
				formData.get('image_url')?.toString().trim() ||
				formData.get('imageUrl')?.toString().trim() ||
				null,
			imageId:
				formData.get('public_id')?.toString().trim() ||
				formData.get('image_id')?.toString().trim() ||
				null,
			description: formData.get('description')?.toString().trim() || null
		};

		if (!id || !values.title) {
			return fail(400, {
				...warningResponse('ID dan Judul Pedoman KKP wajib diisi.', 'warning'),
				values
			});
		}

		if (values.title.length > 255) {
			return fail(400, {
				...warningResponse('Judul Pedoman KKP terlalu panjang, maksimal 255 karakter.', 'warning'),
				values
			});
		}

		try {
			const success = await updatePedomanKkp(
				id,
				values.title,
				values.image_url,
				values.description,
				values.imageId
			);

			if (!success) {
				return fail(500, {
					...warningResponse('Gagal memperbarui data Pedoman KKP.', 'warning'),
					values
				});
			}
		} catch (error: any) {
			console.error('Error updating Pedoman KKP:', error);
			return fail(500, {
				...warningResponse('Terjadi kesalahan sistem saat memperbarui data.', 'warning'),
				values
			});
		}

		return {
			...successResponse('Berhasil memperbarui Pedoman KKP', 'Success')
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
