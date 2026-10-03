import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createPedomanTa } from '$lib/repository/admin/article/akedemik/pedomanTa';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { PedomanTaFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const values: PedomanTaFormValues = {
			title: formData.get('title')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			image_public_id:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null,
			description: formData.get('description')?.toString().trim() || null
		};

		// Validasi input wajib
		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul Pedoman TA wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		// Validasi panjang judul (VARCHAR 255)
		if (values.title.length > 255) {
			return fail(400, {
				...warningResponse(
					'Judul Pedoman TA terlalu panjang, maksimal 255 karakter.',
					'Validasi Gagal'
				),
				values
			});
		}

		const id = randomUUID();

		try {
			const success = await createPedomanTa(
				id,
				values.title,
				values.image_url,
				values.description,
				values.image_public_id
			);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data Pedoman TA ke database.', 'Error Server'),
					values
				});
			}
		} catch (error: any) {
			console.error('Error creating Pedoman TA:', error);
			return fail(500, {
				...errorResponse(
					'Terjadi kesalahan sistem: ' + (error?.message || 'Kesalahan tidak diketahui'),
					'Kesalahan Sistem'
				),
				values
			});
		}

		// Redirect kembali ke halaman daftar setelah berhasil
		// throw redirect(303, '/admin/akademik/pedoman-ta');
		return {
			...successResponse('Pedoman TA berhasil disimpan.', 'Berhasil'),
			values
		};
	},
	// url action untuk Gambar yang di batalin akan mengguanka url ini , karena
	// cloudinary akan meng upload duluan ke cloud nya
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		if (!publicId) {
			return fail(400, errorResponse('Public Id tidak di temukan', 'Error'));
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
