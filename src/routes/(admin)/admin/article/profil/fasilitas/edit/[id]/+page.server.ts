import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { UpdateFacilityDTO } from '$lib/dto/admin/article/profile'; // Sesuaikan path DTO Anda
import {
	getFacilityById,
	getFacilityCategories,
	updateFacility
} from '$lib/repository/admin/article/profile/fasilitas';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import type { FasilitasFormValues } from '$lib/types/values/admin/article';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	// Ambil data fasilitas berdasarkan ID dan daftar kategori unik secara paralel
	const [facility, categories] = await Promise.all([getFacilityById(id), getFacilityCategories()]);

	if (!facility) {
		throw error(404, { message: 'Data fasilitas laboratorium tidak ditemukan.' });
	}

	return {
		facility,
		categories
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const id = params.id || formData.get('id')?.toString();

		//  Ekstraksi data ke objek values terstruktur bertipe FasilitasFormValues
		const values: FasilitasFormValues = {
			name: formData.get('name')?.toString().trim() || '',
			category: formData.get('category')?.toString().trim() || '',
			brandModel:
				formData.get('brandModel')?.toString().trim() ||
				formData.get('brand_model')?.toString().trim() ||
				null,
			description: formData.get('description')?.toString().trim() || null,
			imageUrl:
				formData.get('image_url')?.toString().trim() ||
				formData.get('imageUrl')?.toString().trim() ||
				null,
			imageId:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('image_id')?.toString().trim() ||
				null,
			sopLink:
				formData.get('sop')?.toString().trim() || formData.get('sop_url')?.toString().trim() || null
		};

		if (!id || !values.name || !values.category) {
			return fail(400, {
				...warningResponse('ID, Nama Fasilitas, dan Kategori wajib diisi.', 'warning'),
				values
			});
		}

		// 3. Pengecekan panjang Nama Fasilitas untuk VARCHAR(255)
		if (values.name.length > 255) {
			return fail(400, {
				...warningResponse('Nama Fasilitas terlalu panjang, maksimal 255 karakter.', 'warning'),
				values
			});
		}

		const updateData: UpdateFacilityDTO = {
			name: values.name,
			category: values.category,
			brandModel: values.brandModel,
			description: values.description,
			imageUrl: values.imageUrl,
			image_public_id: values.imageId,
			sopUrl: values.sopLink
		};

		try {
			const success = await updateFacility(id, updateData);

			if (!success) {
				return fail(500, {
					...warningResponse('Gagal memperbarui data fasilitas laboratorium.', 'warning'),
					values
				});
			}
		} catch (err) {
			console.error('Error saat update fasilitas lab:', err);
			return fail(500, {
				...warningResponse('Terjadi kesalahan sistem saat memperbarui data.', 'warning'),
				values
			});
		}

		// Jika menggunakan redirect setelah berhasil:
		// throw redirect(303, '/admin/fasilitas');

		return {
			...successResponse('Berhasil memperbarui data Fasilitas', 'Success')
		};
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
