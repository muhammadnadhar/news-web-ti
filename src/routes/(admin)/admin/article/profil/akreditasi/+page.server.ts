import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getAccreditation,
	getPublicIdAccreditationById,
	upsertAccreditation
} from '$lib/repository/admin/article/profile/akreditasi';
import { randomUUID } from '$lib/crypto';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { AccreditationFormValues } from '$lib/types/values/admin/article';

export const load: PageServerLoad = async () => {
	try {
		const accreditation = await getAccreditation();

		return {
			accreditation
		};
	} catch (err) {
		console.error('Error loading accreditation data:', err);
		throw error(500, 'Gagal mengambil data akreditasi dari server');
	}
};

export const actions: Actions = {
	update: async ({ request }) => {
		const formData = await request.formData();

		const values: AccreditationFormValues = {
			id: formData.get('id') as string,
			description: (formData.get('description') as string)?.trim() || '',
			image_url: (formData.get('image_url') as string)?.trim() || '',
			image_public_id: (formData.get('image_public_id') as string) || null
		};
		console.info('id : ', values.id);

		console.info('akreditasi : ', values.description);

		if (!values.description) {
			return fail(400, {
				...warningResponse('Isi deskripsi akreditasi wajib diisi.', 'Peringatan'),
				values
			});
		}

		if (!values.image_url) {
			return fail(400, {
				...warningResponse('Pastikan gambar akreditasi tersedia.', 'Peringatan'),
				values
			});
		}

		try {
			// Cek gambar lama di database berdasarkan ID
			const oldImagePublicId = await getPublicIdAccreditationById(values.id!);

			// Jika ada gambar lama DAN gambar tersebut diganti/diperbarui dengan yang baru, hapus dari Cloudinary
			if (oldImagePublicId && oldImagePublicId !== values.image_public_id) {
				await deleteImageFromCloudinary(oldImagePublicId);
			}

			// Lakukan upsert (Insert / Update) data ke database
			const success = await upsertAccreditation(values.id!, {
				image_url: values.image_url,
				image_public_id: values.image_public_id,
				description: values.description
			});

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal memperbarui data akreditasi.', 'Gagal Memperbarui'),
					values
				});
			}

			return successResponse('Data akreditasi berhasil diperbarui.', 'Berhasil');
		} catch (err: any) {
			console.error('Error saving accreditation:', err);

			return fail(500, {
				...errorResponse('Terjadi kesalahan sistem saat menyimpan data.', 'Kesalahan Sistem'),
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
