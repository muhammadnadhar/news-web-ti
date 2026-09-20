import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { errorResponse, successResponse } from '$lib/helper/message';
import {
	getObeCurriculum,
	saveOrUpdateObeCurriculum
} from '$lib/repository/admin/article/kurikulum/obe';

export const load: PageServerLoad = async () => {
	try {
		const obeData = await getObeCurriculum();
		return { obeData };
	} catch (err) {
		console.error('Error loading OBE curriculum:', err);
		return successResponse('Gagal mengambil data Kurikulum OBE.', 'Error');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const description = String(formData.get('description') ?? '').trim();

		if (!description) {
			return fail(400, errorResponse('Isi Kurikulum OBE tidak boleh kosong.', 'error'));
		}

		try {
			await saveOrUpdateObeCurriculum(description);
			return successResponse('Berhasil menyimpan data kurikulum OBE', 'Success');
		} catch (err) {
			console.error('Error saving OBE curriculum:', err);
			return fail(500, errorResponse('Gagal menyimpan data Kurikulum OBE.', 'error'));
		}
	}
};
