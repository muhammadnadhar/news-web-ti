import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getPracticumModuleById,
	updatePracticumModule
} from '$lib/repository/admin/article/akedemik/modulePratikum';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { ModulPraktikumFormValues } from '$lib/types/values/admin/article';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	if (!id) {
		return {
			module: null
		};
	}

	const moduleData = await getPracticumModuleById(id);

	if (!moduleData) {
		throw error(404, 'Data Modul Praktikum tidak ditemukan.');
	}

	return {
		module: moduleData
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe ModulPraktikumFormValues
		const values: ModulPraktikumFormValues = {
			id: params.id || formData.get('id')?.toString().trim() || undefined,
			title: formData.get('title')?.toString().trim() || '',
			imageUrl:
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
				...warningResponse('ID Modul Praktikum tidak ditemukan.', 'Gagal'),
				values
			});
		}

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

		try {
			const isUpdated = await updatePracticumModule(
				values.id,
				values.title,
				values.imageUrl,
				values.description,
				values.publicId
			);

			if (!isUpdated) {
				return fail(500, {
					...errorResponse(
						'Data modul praktikum tidak dapat diperbarui di database.',
						'Gagal Memperbarui'
					),
					values
				});
			}

			return {
				...successResponse('Modul praktikum berhasil diperbarui!', 'Berhasil Memperbarui'),
				values
			};
		} catch (err: any) {
			console.error('Error updating Practicum Module:', err);
			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan sistem saat memproses modul praktikum.',
					'Kesalahan Sistem'
				),
				values
			});
		}
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
