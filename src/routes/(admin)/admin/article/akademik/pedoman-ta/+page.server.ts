import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import {
	createPedomanTa,
	deletePedomanTa,
	getAllPedomanTa,
	getPedomanTaById,
	updatePedomanTa
} from '$lib/repository/admin/article/akedemik/pedomanTa';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

export const load: PageServerLoad = async () => {
	try {
		// const rawList = await getAllPedomanTa();

		return {
			pedomanList: getAllPedomanTa()
		};
	} catch (err) {
		console.error('Error loading pedoman TA:', err);
		throw error(500, 'Gagal mengambil data Pedoman Tugas Akhir.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const imageFile = formData.get('image') as File;

		if (!title) {
			return fail(400, { message: 'Judul Pedoman TA wajib diisi.' });
		}

		// Handle file upload
		let imageUrl: string | null = null;
		if (imageFile && imageFile.size > 0) {
			const uploadDir = join(process.cwd(), 'static', 'uploads', 'pedoman-ta');
			if (!existsSync(uploadDir)) {
				mkdirSync(uploadDir, { recursive: true });
			}

			const ext = imageFile.name.split('.').pop();
			const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
			const filePath = join(uploadDir, fileName);
			const buffer = Buffer.from(await imageFile.arrayBuffer());

			writeFileSync(filePath, buffer);
			imageUrl = `/uploads/pedoman-ta/${fileName}`;
		}

		try {
			if (isEdit) {
				await updatePedomanTa(id, title, imageUrl, description);
			} else {
				await createPedomanTa(id, title, imageUrl, description);
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving pedoman TA:', err);
			return fail(500, { message: 'Gagal menyimpan data Pedoman Tugas Akhir.' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, warningResponse('ID Pedoman TA tidak valid.', 'Gagal'));
		}

		try {
			// Ambil data Pedoman TA berdasarkan ID
			const existingData = await getPedomanTaById(id);
			console.info('Data yang di dapat : ', existingData);

			if (!existingData) {
				return fail(404, warningResponse('Data Pedoman TA tidak ditemukan.', 'Gagal'));
			}

			if (existingData.image_public_id) {
				// Catatan natinya loh ya : Jika berkas pedoman berupa PDF/Dokumen (bukan gambar),
				// tambahkan parameter kedua 'raw': await deleteImageFromCloudinary(existingData.image_public_id, 'raw');
				await deleteImageFromCloudinary(existingData.image_public_id);
				console.info('di hapus : ', existingData.image_public_id);
			}

			await deletePedomanTa(id);

			return successResponse('Data Pedoman TA dan berkas terkait berhasil dihapus.', 'Berhasil');
		} catch (err) {
			console.error('Error deleting pedoman TA:', err);
			return fail(500, errorResponse('Gagal menghapus data Pedoman TA.', 'Kesalahan Sistem'));
		}
	}
};
