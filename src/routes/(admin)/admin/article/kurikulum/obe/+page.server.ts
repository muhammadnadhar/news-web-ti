import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getObeCurriculum,
	saveOrUpdateObeCurriculum
} from '$lib/server/admin/repository/article/kurikulum/obe';

export const load: PageServerLoad = async () => {
	try {
		const obeData = await getObeCurriculum();
		return {
			obeData
		};
	} catch (err) {
		console.error('Error loading OBE curriculum:', err);
		throw error(500, 'Gagal mengambil data Kurikulum OBE.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const description = formData.get('description') as string;

		if (!description || description.trim() === '') {
			return fail(400, { message: 'Isi Kurikulum OBE tidak boleh kosong.' });
		}

		try {
			await saveOrUpdateObeCurriculum(description);
			return { success: true };
		} catch (err) {
			console.error('Error saving OBE curriculum:', err);
			return fail(500, { message: 'Gagal menyimpan data Kurikulum OBE.' });
		}
	}
};
