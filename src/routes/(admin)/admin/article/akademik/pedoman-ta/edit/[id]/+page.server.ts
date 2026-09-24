import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

import { errorResponse, successResponse } from '$lib/helper/message';
import {
	getPedomanTaById,
	updatePedomanTa
} from '$lib/repository/admin/article/akedemik/pedomanTa';
import { cloudinary } from '$lib/cloudinary/server';

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
		const { id } = params;
		const formData = await request.formData();

		const title = (formData.get('title') as string)?.trim();
		const image_url = (formData.get('image_url') as string)?.trim() || null;
		const description = (formData.get('description') as string)?.trim() || null;

		if (!title) {
			return fail(400, {
				...errorResponse('Judul Pedoman TA wajib diisi.', 'Validasi Gagal'),
				values: { title, image_url, description }
			});
		}

		try {
			await updatePedomanTa(id, title, image_url, description);

			return successResponse('Data Pedoman TA berhasil diperbarui.', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating Pedoman TA:', err);
			return fail(500, {
				...errorResponse('Gagal memperbarui data Pedoman TA ke database.', 'Error Server'),
				values: { title, image_url, description }
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
			await cloudinary.uploader.destroy(publicId);
			return successResponse('Berhasil di batalkan', 'Succcess');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto ', 'Gagal'));
		}
	}
};
