import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getAllPedomanTa,
	createPedomanTa,
	updatePedomanTa,
	deletePedomanTa
} from '$lib/server/admin/repository/article/akedemik/pedomanTa';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const load: PageServerLoad = async () => {
	try {
		const rawList = await getAllPedomanTa();

		return {
			pedomanList: rawList
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

		if (!id) return fail(400, { message: 'ID tidak valid.' });

		try {
			await deletePedomanTa(id);
			return { success: true };
		} catch (err) {
			console.error('Error deleting pedoman TA:', err);
			return fail(500, { message: 'Gagal menghapus data Pedoman TA.' });
		}
	}
};
