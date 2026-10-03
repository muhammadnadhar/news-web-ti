import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getRecruitmentById,
	updateRecruitment
} from '$lib/repository/admin/article/akedemik/ketentuan-komprehensif';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { KetentuanKomprehensifFormValues } from '$lib/types/values/admin/article';

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
	update: async ({ request, params }) => {
		const formData = await request.formData();

		const values: KetentuanKomprehensifFormValues = {
			id: params.id || formData.get('id')?.toString().trim() || undefined,
			title: formData.get('title')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			image_public_id: formData.get('public_id')?.toString().trim() || null,
			description: formData.get('description')?.toString().trim() || null
		};

		if (!values.id) {
			return fail(400, {
				...warningResponse('ID Ketentuan Komprehensif tidak ditemukan.', 'Gagal'),
				values
			});
		}

		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul / Ketentuan Komprehensif wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (values.title.length > 255) {
			return fail(400, {
				...warningResponse('Judul terlalu panjang, maksimal 255 karakter.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const success = await updateRecruitment(
				values.id,
				values.title,
				values.image_url,
				values.description,
				values.image_public_id
			);

			if (!success) {
				return fail(500, {
					...errorResponse(
						'Gagal memperbarui data Ketentuan Komprehensif di database.',
						'Gagal Menyimpan'
					),
					values
				});
			}

			return {
				...successResponse('Data Ketentuan Komprehensif berhasil diperbarui!', 'Berhasil'),
				values
			};
		} catch (err: any) {
			console.error('Error updating Ketentuan Komprehensif:', err);
			return fail(500, {
				...errorResponse(
					`Gagal memperbarui data pada server: ${err?.message || 'Terjadi kesalahan sistem'}`,
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
