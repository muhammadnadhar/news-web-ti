import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { addProfileDashboard } from '$lib/repository/admin/home/profileDashboard';
import type { ProfileDashboardFormValues } from '$lib/types/values/admin/home';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe ProfileDashboardFormValues
		const values: ProfileDashboardFormValues = {
			id: (formData.get('id') as string)?.trim() || crypto.randomUUID(),
			title: (formData.get('title') as string)?.trim() || '',
			imagePath:
				((formData.get('image_path') || formData.get('image_url')) as string)?.trim() || '',
			image_public_id: (formData.get('image_public_id') as string)?.trim() || undefined
		};

		// Validasi Input Mandatory
		if (!values.title || !values.imagePath) {
			return fail(400, {
				...warningResponse('Judul dan Gambar wajib diisi!', 'Validasi Gagal'),
				values
			});
		}

		try {
			// Simpan Data ke Database
			await addProfileDashboard(values.id ?? randomUUID(), {
				title: values.title,
				image_path: values.imagePath,
				image_public_id: values.image_public_id
			});

			return successResponse('Berhasil menambahkan Profile Dashboard baru!', 'Berhasil');
		} catch (error: any) {
			console.error('Database Error:', error);

			// Cleanup: hapus gambar dari Cloudinary jika simpan DB gagal
			if (values.image_public_id) {
				try {
					await deleteImageFromCloudinary(values.image_public_id);
					console.log(`Berhasil menghapus file orphan dari Cloudinary: ${values.image_public_id}`);
				} catch (cleanupError) {
					console.error('Gagal melakukan cleanup Cloudinary:', cleanupError);
				}
			}

			return fail(500, {
				...errorResponse(error?.message || 'Gagal menyimpan data ke database.', 'Kesalahan Server'),
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
