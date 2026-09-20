import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import {
	createScholarship,
	deleteScholarship,
	getAllScholarships,
	updateScholarship
} from '$lib/repository/admin/article/kemahasiswaan/beasiswa';

export const load: PageServerLoad = async () => {
	try {
		// const rawList = await getAllScholarships();

		// Transformasi data DB ke format TableContentType untuk komponen TableContent
		// const scholarshipList: TableContentType[] = rawList.map((item) => ({
		// 	id: item.id,
		// 	items: [
		// 		{
		// 			colomn: 'Nama',
		// 			row: item.student_name
		// 		},
		// 		{
		// 			colomn: 'Beasiswa',
		// 			row: item.scholarship_name
		// 		}
		// 	]
		// }));

		return {
			// scholarshipList,
			rawScholarshipList: getAllScholarships()
		};
	} catch (err) {
		console.error('Error loading scholarships:', err);
		throw error(500, 'Gagal mengambil data Beasiswa.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const studentName = formData.get('student_name') as string;
		const scholarshipName = formData.get('scholarship_name') as string;

		if (!studentName || !scholarshipName) {
			return fail(400, { message: 'Nama Mahasiswa dan Jenis Beasiswa wajib diisi.' });
		}

		try {
			if (isEdit) {
				await updateScholarship(id, studentName, scholarshipName);
			} else {
				await createScholarship(id, studentName, scholarshipName);
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving scholarship:', err);
			return fail(500, { message: 'Gagal menyimpan data Beasiswa.' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { message: 'ID tidak valid.' });

		try {
			await deleteScholarship(id);
			return { success: true };
		} catch (err) {
			console.error('Error deleting scholarship:', err);
			return fail(500, { message: 'Gagal menghapus data Beasiswa.' });
		}
	}
};
