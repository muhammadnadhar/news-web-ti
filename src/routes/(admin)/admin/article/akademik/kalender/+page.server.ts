import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getActiveAcademicCalendar,
	saveAcademicCalendar
} from '$lib/server/admin/repository/article/akedemik/kalender';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const load: PageServerLoad = async () => {
	try {
		const calendar = await getActiveAcademicCalendar();
		return {
			calendar
		};
	} catch (err) {
		console.error('Error loading calendar:', err);
		throw error(500, 'Gagal memuat data Kalender Akademik.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const title = (formData.get('title') as string) || 'Kalender Akademik';
		const description = formData.get('description') as string;
		const files = formData.getAll('images') as File[];

		if (!description) {
			return fail(400, { message: 'Deskripsi wajib diisi.' });
		}

		// Handle Upload Gambar jika ada
		const uploadedPaths: string[] = [];
		if (files && files.length > 0 && files[0].size > 0) {
			const uploadDir = join(process.cwd(), 'static', 'uploads', 'kalender');
			if (!existsSync(uploadDir)) {
				mkdirSync(uploadDir, { recursive: true });
			}

			for (const file of files) {
				if (file.size > 0) {
					const ext = file.name.split('.').pop();
					const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
					const filePath = join(uploadDir, fileName);
					const buffer = Buffer.from(await file.arrayBuffer());

					writeFileSync(filePath, buffer);
					uploadedPaths.push(`/uploads/kalender/${fileName}`);
				}
			}
		}

		try {
			await saveAcademicCalendar(id, title, description);
			return { success: true, uploadedPaths };
		} catch (err) {
			console.error('Error saving calendar:', err);
			return fail(500, { message: 'Gagal menyimpan data Kalender Akademik.' });
		}
	}
};
