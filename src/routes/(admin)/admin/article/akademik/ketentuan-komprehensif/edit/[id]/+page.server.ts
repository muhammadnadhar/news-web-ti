import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getRecruitmentById,
	updateRecruitment
} from '$lib/repository/admin/article/akedemik/ketentuan-komprehensif';
import { errorResponse, successResponse } from '$lib/helper/message';
import { cloudinary } from '$lib/cloudinary/server';

// Load: Mengambil data rekrutmen spesifik berdasarkan ID dari URL Params
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID Rekrutmen tidak valid.');
	}

	const recruitment = await getRecruitmentById(id);

	if (!recruitment) {
		throw error(404, 'Data Rekrutmen tidak ditemukan.');
	}

	// Format data agar sesuai dengan prop initialData pada FormKetentuan
	return {
		ketentuan: {
			id: recruitment.id,
			title: recruitment.title,
			imageUrl: recruitment.image_url,
			description: recruitment.description
		}
	};
};

// Actions: Menangani Update & Delete Data Form
export const actions: Actions = {
	// Action Default: Memperbarui Data Rekrutmen
	update: async ({ request, params }) => {
		const { id } = params;

		if (!id) {
			return fail(400, errorResponse('ID Rekruitmen tidak di temukan', 'Gagal'));
		}

		const formData = await request.formData();
		const title = (formData.get('title') as string)?.trim();
		const imageUrl = (formData.get('image_url') as string)?.trim() || null;
		const description = (formData.get('description') as string)?.trim() || null;

		// Validasi Input Wajib
		if (!title) {
			return fail(400, {
				values: { title, imageUrl, description },
				message: {
					type: 'error',
					title: 'Validasi Gagal',
					message: 'Judul / Ketentuan Rekrutmen wajib diisi.'
				}
			});
		}

		try {
			const success = await updateRecruitment(id, title, imageUrl, description);

			if (!success) {
				return fail(500, {
					values: { title, imageUrl, description },
					...errorResponse('Gagal memperbarui data', 'Gagal menyimpan data')
				});
			}

			return {
				values: { title, imageUrl, description },
				message: {
					type: 'success',
					title: 'Berhasil',
					message: 'Data Rekrutmen berhasil diperbarui!'
				}
			};
		} catch (err: any) {
			return fail(500, {
				values: { title, imageUrl, description },
				message: {
					type: 'error',
					title: 'Terjadi Kesalahan',
					message: err?.message || 'Gagal memperbarui data pada server.'
				}
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
