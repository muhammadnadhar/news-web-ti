import { fail, error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	deleteProfileDashboard,
	getProfileDashboardById,
	updateProfileDashboard
} from '$lib/repository/admin/home/profileDashboard';
import type { ProfileDashboardFormValues } from '$lib/types/values/admin/home';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	if (!id) {
		throw error(400, 'ID Profile Dashboard tidak valid.');
	}

	const profile = await getProfileDashboardById(id);

	if (!profile) {
		throw error(404, 'Data Profile Dashboard tidak ditemukan.');
	}

	return {
		profile
	};
};

export const actions: Actions = {
	// Action untuk Update Data
	update: async ({ request, params }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe ProfileDashboardFormValues
		const values: ProfileDashboardFormValues = {
			id: (formData.get('id') as string)?.trim() || params.id,
			title: (formData.get('title') as string)?.trim() || '',
			imagePath:
				((formData.get('image_path') || formData.get('image_url')) as string)?.trim() || '',
			image_public_id: (formData.get('image_public_id') as string)?.trim() || undefined
		};

		// Validasi ID
		if (!values.id) {
			return fail(400, {
				...errorResponse('ID Profile Dashboard tidak ditemukan.', 'Validasi Gagal'),
				values
			});
		}

		// Validasi field wajib
		if (!values.title || !values.imagePath) {
			return fail(400, {
				...warningResponse('Profile text dan gambar wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const isUpdated = await updateProfileDashboard(values.id, {
				title: values.title,
				image_path: values.imagePath,
				image_public_id: values.image_public_id
			});

			if (!isUpdated) {
				return fail(500, {
					...errorResponse('Gagal memperbarui data di database.', 'Gagal Memperbarui'),
					values
				});
			}

			return successResponse('Profile Dashboard berhasil diperbarui!', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating Profile Dashboard:', err);

			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan sistem saat memperbarui data.',
					'Kesalahan Server'
				),
				values
			});
		}
	},

	// Action untuk Delete Data
	delete: async ({ request, params }) => {
		const formData = await request.formData();

		const id = (formData.get('id') as string)?.trim() || params.id;
		const publicId = (formData.get('image_public_id') as string)?.trim();

		if (!id) {
			return fail(400, errorResponse('ID Profile Dashboard tidak ditemukan.', 'Validasi Gagal'));
		}

		try {
			// 1. Hapus data dari Database
			const isDeleted = await deleteProfileDashboard(id);

			if (!isDeleted) {
				return fail(
					500,
					errorResponse('Gagal menghapus data Profile Dashboard dari database.', 'Gagal Menghapus')
				);
			}

			// 2. Cleanup gambar dari Cloudinary jika image_public_id tersedia
			if (publicId) {
				try {
					await cloudinary.uploader.destroy(publicId);
					console.log(`Berhasil menghapus file dari Cloudinary: ${publicId}`);
				} catch (cloudinaryErr) {
					console.error('Gagal menghapus gambar dari Cloudinary:', cloudinaryErr);
				}
			}

			return successResponse('Profile Dashboard berhasil dihapus!', 'Berhasil');
		} catch (err: any) {
			console.error('Error deleting Profile Dashboard:', err);

			return fail(
				500,
				errorResponse(
					err?.message || 'Terjadi kesalahan sistem saat menghapus data.',
					'Kesalahan Server'
				)
			);
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
