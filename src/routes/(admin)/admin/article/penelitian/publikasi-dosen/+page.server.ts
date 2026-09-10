import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getAllLecturerPublications,
	createLecturerPublication,
	updateLecturerPublication,
	deleteLecturerPublication
} from '$lib/server/admin/repository/article/penelitian/publikasiDosen';

import type { TableContentType } from '$lib/types/tableContent';

export const load: PageServerLoad = async () => {
	try {
		const rawList = await getAllLecturerPublications();

		// Transformasi data DB ke format TableContentType untuk komponen TableContent
		const publicationList: TableContentType[] = rawList.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Nama Dosen',
					row: item.lecturer_name
				},
				{
					colomn: 'Profil SINTA',
					row: item.sinta_link || '-'
				},
				{
					colomn: 'Google Scholar',
					row: item.scholar_link || '-'
				}
			]
		}));

		return {
			publicationList,
			rawPublicationList: rawList
		};
	} catch (err) {
		console.error('Error loading lecturer publications:', err);
		throw error(500, 'Gagal mengambil data Publikasi Dosen.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const lecturerName = formData.get('lecturer_name') as string;
		const sintaLink = formData.get('sinta_link') as string;
		const scholarLink = formData.get('scholar_link') as string;

		if (!lecturerName || lecturerName.trim() === '') {
			return fail(400, { message: 'Nama Dosen wajib diisi.' });
		}

		try {
			if (isEdit) {
				await updateLecturerPublication(id, lecturerName, sintaLink, scholarLink);
			} else {
				await createLecturerPublication(id, lecturerName, sintaLink, scholarLink);
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving lecturer publication:', err);
			return fail(500, { message: 'Gagal menyimpan data Publikasi Dosen.' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { message: 'ID tidak valid.' });

		try {
			await deleteLecturerPublication(id);
			return { success: true };
		} catch (err) {
			console.error('Error deleting lecturer publication:', err);
			return fail(500, { message: 'Gagal menghapus data Publikasi Dosen.' });
		}
	}
};
