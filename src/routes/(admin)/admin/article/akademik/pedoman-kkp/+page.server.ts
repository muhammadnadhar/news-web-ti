import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import {
	createPedomanKkp,
	deletePedomanKkp,
	getAllPedomanKkp,
	getPedomanKkpById,
	updatePedomanKkp
} from '$lib/repository/admin/article/akedemik/pedomanKKP';
import { errorResponse, successResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

export const load: PageServerLoad = async () => {
	try {
		// const rawList = await getAllPedomanKkp();

		// Transformasi data DB ke format TableContentType untuk komponen TableContent
		// const pedomanList: TableContentType[] = rawList.map((item) => ({
		// 	id: item.id,
		// 	items: [
		// 		{
		// 			colomn: 'Judul',
		// 			row: item.title
		// 		},
		// 		{
		// 			colomn: 'Foto',
		// 			row: item.image_url || '-'
		// 		},
		// 		{
		// 			colomn: 'Description',
		// 			row: item.description || '-'
		// 		}
		// 	]
		// }));

		return {
			rawPedomanList: getAllPedomanKkp()
		};
	} catch (err) {
		console.error('Error loading pedoman KKP:', err);
		throw error(500, 'Gagal mengambil data Pedoman Kuliah Kerja Praktek.');
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
			return fail(400, { message: 'Judul Pedoman KKP wajib diisi.' });
		}

		// Handle file upload
		let imageUrl: string | null = null;
		if (imageFile && imageFile.size > 0) {
			const uploadDir = join(process.cwd(), 'static', 'uploads', 'pedoman-kkp');
			if (!existsSync(uploadDir)) {
				mkdirSync(uploadDir, { recursive: true });
			}

			const ext = imageFile.name.split('.').pop();
			const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
			const filePath = join(uploadDir, fileName);
			const buffer = Buffer.from(await imageFile.arrayBuffer());

			writeFileSync(filePath, buffer);
			imageUrl = `/uploads/pedoman-kkp/${fileName}`;
		}

		try {
			if (isEdit) {
				await updatePedomanKkp(id, title, imageUrl, description);
			} else {
				await createPedomanKkp(id, title, imageUrl, description);
			}
			// return { success: true };
			return successResponse('Berhaisil menyimpan Pedoman KKP');
		} catch (err) {
			console.error('Error saving pedoman KKP:', err);
			// return fail(500, { message: 'Gagal menyimpan data Pedoman KKP.' });
			return fail(500, errorResponse('Gagal menyimpan data Pedoman KKP'));
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, errorResponse('ID pedoman KKP tidak valid.', 'Gagal'));
		}

		try {
			//  Ambil data pedoman KKP berdasarkan ID terlebih dahulu
			const existingData = await getPedomanKkpById(id);

			if (!existingData) {
				return fail(404, errorResponse('Data pedoman KKP tidak ditemukan.', 'Gagal'));
			}

			//  Jika terdapat public_id (image/file), hapus aset dari Cloudinary
			// Sesuaikan nama field di DTO/tabel Anda (misal: image_public_id atau file_public_id)
			if (existingData.image_public_id) {
				await deleteImageFromCloudinary(existingData.image_public_id);
			}

			// Hapus data dari database
			await deletePedomanKkp(id);

			//  Kembalikan response sukses
			return successResponse('Data pedoman KKP dan berkas terkait berhasil dihapus.', 'Berhasil');
		} catch (err) {
			console.error('Error deleting pedoman KKP:', err);
			return fail(500, errorResponse('Gagal menghapus data pedoman KKP.', 'Kesalahan Sistem'));
		}
	}
};
