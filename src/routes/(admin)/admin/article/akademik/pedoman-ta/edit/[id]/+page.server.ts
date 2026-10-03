import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import {
	getPedomanTaById,
	updatePedomanTa
} from '$lib/repository/admin/article/akedemik/pedomanTa';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { PedomanTaFormValues } from '$lib/types/values/admin/article';

// Fetch data awal berdasarkan ID
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		const rows = await getPedomanTaById(id);

		if (!rows) {
			// throw error(404, 'Data Pedoman TA tidak ditemukan.')
			return fail(404, errorResponse('Data Pedoman TA tidak ditemukan.', 'error'));
		}

		return {
			pedomanTa: rows
		};
	} catch (err: any) {
		if (err.status === 404) throw err;
		console.error('Error fetching Pedoman TA:', err);
		throw error(500, 'Gagal mengambil data Pedoman TA dari database.');
	}
};

// Menangani aksi UPDATE saat form disubmit
export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();

		const values: PedomanTaFormValues = {
			id: params.id || formData.get('id')?.toString().trim() || undefined,
			title: formData.get('title')?.toString().trim() || '',
			image_url:
				formData.get('image_url')?.toString().trim() ||
				formData.get('imageUrl')?.toString().trim() ||
				null,
			publicId:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null,
			description: formData.get('description')?.toString().trim() || null
		};

		if (!values.id) {
			return fail(400, {
				...warningResponse('ID Pedoman TA tidak ditemukan.', 'Gagal'),
				values
			});
		}

		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul Pedoman TA wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (values.title.length > 255) {
			return fail(400, {
				...warningResponse(
					'Judul Pedoman TA terlalu panjang, maksimal 255 karakter.',
					'Validasi Gagal'
				),
				values
			});
		}

		try {
			const success = await updatePedomanTa(
				values.id,
				values.title,
				values.image_url,
				values.description,
				values.image_public_id
			);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal memperbarui data Pedoman TA ke database.', 'Error Server'),
					values
				});
			}

			return {
				...successResponse('Data Pedoman TA berhasil diperbarui.', 'Berhasil'),
				values
			};
		} catch (err: any) {
			console.error('Error updating Pedoman TA:', err);
			return fail(500, {
				...errorResponse(
					`Gagal memperbarui data Pedoman TA ke database: ${err?.message || 'Terjadi kesalahan sistem'}`,
					'Error Server'
				),
				values
			});
		}
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
