import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getLecturerResearch,
	saveOrUpdateLecturerResearch
} from '$lib/server/admin/repository/article/penelitian/penelitianDosen';

export const load: PageServerLoad = async () => {
	try {
		const researchData = await getLecturerResearch();
		return {
			researchData
		};
	} catch (err) {
		console.error('Error loading lecturer research:', err);
		throw error(500, 'Gagal mengambil data Penelitian Dosen.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const description = formData.get('description') as string;

		if (!description || description.trim() === '') {
			return fail(400, { message: 'Isi Penelitian Dosen tidak boleh kosong.' });
		}

		try {
			await saveOrUpdateLecturerResearch(description);
			return { success: true };
		} catch (err) {
			console.error('Error saving lecturer research:', err);
			return fail(500, { message: 'Gagal menyimpan data Penelitian Dosen.' });
		}
	}
};
