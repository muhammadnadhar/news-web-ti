import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	deleteFacility,
	getFacilities,
	getPublicIdFacilityById
} from '$lib/repository/admin/article/profile/fasilitas';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

export const load: PageServerLoad = async () => {
	// Mengembalikan promise untuk streaming data dengan {#await data.fasilitis}
	return {
		fasilitis: getFacilities()
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString().trim();

		if (!id) {
			return fail(400, warningResponse('ID fasilitas tidak valid.', 'Gagal'));
		}

		try {
			// Ambil image_public_id terlebih dahulu secara efisien
			const imagePublicId = await getPublicIdFacilityById(id);

			//  Jika ada aset gambar terkait di Cloudinary, lakukan pembersihan
			if (imagePublicId) {
				await deleteImageFromCloudinary(imagePublicId);
			}

			const success = await deleteFacility(id);

			if (!success) {
				return fail(
					400,
					warningResponse('Data fasilitas gagal dihapus atau tidak ditemukan.', 'Gagal')
				);
			}

			//  Return response sukses tersinkronisasi
			return successResponse(
				'Data fasilitas laboratorium dan berkas terkait berhasil dihapus.',
				'Berhasil'
			);
		} catch (err: any) {
			console.error('Error saat menghapus fasilitas:', err);

			return fail(
				500,
				errorResponse('Terjadi kesalahan sistem saat menghapus data fasilitas.', 'Kesalahan Sistem')
			);
		}
	}
};
