import { fail, redirect } from '@sveltejs/kit';
import type { Actions} from './$types';
import { createCurriculums } from '$lib/repository/admin/article/kurikulum/kurikulum';
import type { ImageItem } from '$lib/dto/admin/home';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import { errorResponse, successResponse } from '$lib/helper/message';
import type { kurikulumsFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const description = formData.get('description')?.toString() || '';
		const imagesJsonStr = formData.get('images_json')?.toString() || '[]';
		const title = formData.get('title')?.toString() || '[]';

	// Parsing string JSON dari form kembali ke bentuk array ImageItem[] untuk database
		let parsedImages: ImageItem[] = [];
		try {
			parsedImages = JSON.parse(imagesJsonStr);
		} catch (e) {
			parsedImages = [];
		}


		// Menyiapkan nilai form sesuai interface kurikulumsFormValues
		const values: kurikulumsFormValues = {
			description,
			title,
			images: parsedImages // Menyesuaikan tipe string[] pada interface values
		};

			// Validasi input
		if (!values.description.trim()) {
			return fail(400, {
				...errorResponse('Deskripsi kurikulum tidak boleh kosong', 'Validasi Gagal'),
				values
			});
		}

		try {
			const success = await createCurriculums({
				description: values.description,
				images: parsedImages,
				title: values.title
			});

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data kurikulum ke database.', 'Gagal'),
					values
				});
			}

			// Kembalikan respons sukses atau lakukan redirect
			return successResponse('Kurikulum berhasil ditambahkan.', 'Berhasil');
			// throw redirect(303, '/admin/kurikulum');
		} catch (error: any) {
			if (error?.status === 303) throw error;

			console.error('Error saving curriculum:', error);
			return fail(500, {
				...errorResponse('Terjadi kesalahan pada server saat menyimpan.', 'Kesalahan Server'),
				values
			});
		}
	},

	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		if (!publicId) {
			return fail(400, errorResponse('Public ID tidak ditemukan', 'Error'));
		}

		try {
			await deleteImageFromCloudinary(publicId);
			return successResponse('Gambar berhasil dihapus', 'Success');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto dari Cloudinary', 'Gagal'));
		}
	}
};
