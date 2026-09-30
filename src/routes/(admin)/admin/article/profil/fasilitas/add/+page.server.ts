import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import { createFacility } from '$lib/repository/admin/article/profile/fasilitas';
import type { CreateFacilityDTO } from '$lib/dto/admin/article/profile';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { FasilitasFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values terstruktur bertipe FasilitasFormValues
		const values: FasilitasFormValues = {
			name: formData.get('name')?.toString().trim() || '',
			category: formData.get('category')?.toString().trim() || '',
			brandModel: formData.get('brandModel')?.toString().trim() || null,
			description: formData.get('description')?.toString().trim() || null,
			imageUrl: formData.get('image_url')?.toString().trim() || null,
			imageId:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('image_id')?.toString().trim() ||
				null,
			sopLink: formData.get('sop')?.toString().trim() || null
		};

		if (!values.name || !values.category) {
			return fail(400, {
				...warningResponse('Nama Fasilitas dan Kategori wajib diisi.', 'warning'),
				values
			});
		}

		if (values.name.length > 255) {
			return fail(400, {
				...warningResponse('Nama Fasilitas terlalu panjang, maksimal 255 karakter.', 'warning'),
				values
			});
		}

		try {
			const id = randomUUID();

			const facilityData: CreateFacilityDTO = {
				name: values.name,
				category: values.category,
				brandModel: values.brandModel,
				description: values.description,
				imageUrl: values.imageUrl,
				image_public_id: values.imageId,
				sopUrl: values.sopLink
			};

			const success = await createFacility(id, facilityData);

			if (!success) {
				return fail(500, {
					...warningResponse('Gagal menyimpan data ke database.', 'warning'),
					values
				});
			}
		} catch (err) {
			console.error('Error upload Cloudinary / Database:', err);
			return fail(500, {
				...warningResponse(
					'Terjadi kesalahan saat mengunggah berkas ke Cloudinary / Database.',
					'warning'
				),
				values
			});
		}

		return {
			...successResponse('Lab Fasilitas berhasil dibuat', 'Success')
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
