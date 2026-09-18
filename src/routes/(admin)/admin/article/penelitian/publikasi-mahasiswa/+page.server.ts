import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getAllStudentPublications,
	createStudentPublication,
	updateStudentPublication,
	deleteStudentPublication
} from '$lib/server/admin/repository/article/penelitian/publikasiMahasiswa';

import type { TableContentType } from '$lib/types/tableContent';

export const load: PageServerLoad = async () => {
	try {
		// const rawList = await getAllStudentPublications();

		// Transformasi data DB ke format TableContentType untuk komponen TableContent
		// const publicationList: TableContentType[] = rawList.map((item) => ({
		// 	id: item.id,
		// 	items: [
		// 		{
		// 			colomn: 'Nama Mahasiswa',
		// 			row: item.student_name
		// 		},
		// 		{
		// 			colomn: 'Daftar Jurnal',
		// 			row: item.journal_list
		// 		}
		// 	]
		// }));

		return {
			// publicationList,
			rawPublicationList: getAllStudentPublications()
		};
	} catch (err) {
		console.error('Error loading student publications:', err);
		throw error(500, 'Gagal mengambil data Publikasi Mahasiswa.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const studentName = formData.get('student_name') as string;
		const journalList = formData.get('journal_list') as string;

		if (!studentName || studentName.trim() === '') {
			return fail(400, { message: 'Nama Mahasiswa wajib diisi.' });
		}

		if (!journalList || journalList.trim() === '') {
			return fail(400, { message: 'Daftar Jurnal wajib diisi.' });
		}

		try {
			if (isEdit) {
				await updateStudentPublication(id, studentName, journalList);
			} else {
				await createStudentPublication(id, studentName, journalList);
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving student publication:', err);
			return fail(500, { message: 'Gagal menyimpan data Publikasi Mahasiswa.' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { message: 'ID tidak valid.' });

		try {
			await deleteStudentPublication(id);
			return { success: true };
		} catch (err) {
			console.error('Error deleting student publication:', err);
			return fail(500, { message: 'Gagal menghapus data Publikasi Mahasiswa.' });
		}
	}
};
