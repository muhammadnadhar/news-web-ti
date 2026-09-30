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
	default: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || randomUUID();
		const description = formData.get('description') as string;
		const imageUrl = formData.get('image_url') as string;
		const imagePublicId = formData.get('image_public_id') as string | null;

		if (!description || description.trim().length === 0) {
			return fail(400, warningResponse('Isi deskripsi akreditasi wajib diisi.', 'Peringatan'));
		}

		if (!imageUrl || imageUrl.trim().length === 0) {
			return fail(400, warningResponse('Pastikan gambar akreditasi tersedia.', 'Peringatan'));
		}

		try {
			//  Cek gambar lama di database berdasarkan ID
			const oldImagePublicId = await getPublicIdAccreditationById(id);

			//  Jika ada gambar lama DAN gambar tersebut diganti/diperbarui dengan yang baru, hapus gambar lama dari Cloudinary
			if (oldImagePublicId && oldImagePublicId !== imagePublicId) {
				await deleteImageFromCloudinary(oldImagePublicId);
			}

			// Lakukan upsert (Insert / Update) data ke database
			const success = await upsertAccreditation(id, {
				image_url: imageUrl,
				image_public_id: imagePublicId,
				description
			});

			if (!success) {
				return fail(500, errorResponse('Gagal memperbarui data akreditasi.', 'Gagal Memperbarui'));
			}

			return successResponse('Data akreditasi berhasil diperbarui.', 'Berhasil');
		} catch (err) {
			console.error('Error saving accreditation:', err);

			return fail(
				500,
				errorResponse('Terjadi kesalahan sistem saat menyimpan data.', 'Kesalahan Sistem')
			);
		}
	}
};
