import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import {
	getAllRecruitment,
	createRecruitment,
	updateRecruitment,
	deleteRecruitment
} from '$lib/repository/admin/article/akedemik/ketentuan-komprehensif';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';

export const load: PageServerLoad = async () => {
	try {
		// const rawList = await getAllRecruitment();

		// Transformasi data DB ke format TableContentType untuk komponen TableContent
		// const recruitmentList: TableContentType[] = rawList.map((item) => ({
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
			// recruitmentList,
			rawRecruitmentList: getAllRecruitment()
		};
	} catch (err) {
		console.error('Error loading recruitment:', err);
		// throw error(500, 'Gagal mengambil data Rekrutmen.');
		return errorResponse('Gagal mengambil data rekrutmen', 'Gagal');
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
			return fail(400, { message: 'Judul Rekrutmen wajib diisi.' });
		}

		// Handle upload foto pendukung
		let imageUrl: string | null = null;
		if (imageFile && imageFile.size > 0) {
			const uploadDir = join(process.cwd(), 'static', 'uploads', 'rekrutmen');
			if (!existsSync(uploadDir)) {
				mkdirSync(uploadDir, { recursive: true });
			}

			const ext = imageFile.name.split('.').pop();
			const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
			const filePath = join(uploadDir, fileName);
			const buffer = Buffer.from(await imageFile.arrayBuffer());

			writeFileSync(filePath, buffer);
			imageUrl = `/uploads/rekrutmen/${fileName}`;
		}

		try {
			if (isEdit) {
				await updateRecruitment(id, title, imageUrl, description);
			} else {
				await createRecruitment(id, title, imageUrl, description);
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving recruitment:', err);
			return fail(500, errorResponse('Gagal menyimpan data Rekrutmen'));
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, warningResponse('ID tidak valid'));

		try {
			await deleteRecruitment(id);
			// return { success: true };
			return successResponse('Berhasil mengahapus data Rekrutmen', 'success Response');
		} catch (err) {
			console.error('Error deleting recruitment:', err);
			return fail(500, errorResponse('Gagal menghapus data Rekrutmen', 'Gagal'));
		}
	}
};
