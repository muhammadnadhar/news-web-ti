import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getAllPracticumModule,
	createPracticumModule,
	updatePracticumModule,
	deletePracticumModule
} from '$lib/server/admin/repository/article/akedemik/modulePratikum';
import type { TableContentType } from '$lib/types/tableContent';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const load: PageServerLoad = async () => {
	try {
		const rawList = await getAllPracticumModule();

		// Transformasi data DB ke format TableContentType untuk komponen TableContent
		const moduleList: TableContentType[] = rawList.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Judul',
					row: item.title
				},
				{
					colomn: 'Foto',
					row: item.image_url || '-'
				},
				{
					colomn: 'Description',
					row: item.description || '-'
				}
			]
		}));

		return {
			moduleList,
			rawModuleList: rawList
		};
	} catch (err) {
		console.error('Error loading practicum module:', err);
		throw error(500, 'Gagal mengambil data Modul Praktikum.');
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
			return fail(400, { message: 'Judul Modul Praktikum wajib diisi.' });
		}

		// Handle upload file foto pendukung
		let imageUrl: string | null = null;
		if (imageFile && imageFile.size > 0) {
			const uploadDir = join(process.cwd(), 'static', 'uploads', 'modul-praktikum');
			if (!existsSync(uploadDir)) {
				mkdirSync(uploadDir, { recursive: true });
			}

			const ext = imageFile.name.split('.').pop();
			const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
			const filePath = join(uploadDir, fileName);
			const buffer = Buffer.from(await imageFile.arrayBuffer());

			writeFileSync(filePath, buffer);
			imageUrl = `/uploads/modul-praktikum/${fileName}`;
		}

		try {
			if (isEdit) {
				await updatePracticumModule(id, title, imageUrl, description);
			} else {
				await createPracticumModule(id, title, imageUrl, description);
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving practicum module:', err);
			return fail(500, { message: 'Gagal menyimpan data Modul Praktikum.' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { message: 'ID tidak valid.' });

		try {
			await deletePracticumModule(id);
			return { success: true };
		} catch (err) {
			console.error('Error deleting practicum module:', err);
			return fail(500, { message: 'Gagal menghapus data Modul Praktikum.' });
		}
	}
};
