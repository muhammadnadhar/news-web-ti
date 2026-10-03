import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import {
	getObeCurriculum,
	saveOrUpdateObeCurriculum
} from '$lib/repository/admin/article/kurikulum/obe';
import type { ObeFormValues } from '$lib/types/values/admin/article';

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
	default: async ({ request }) => {
		const formData = await request.formData();

		const values: ObeFormValues = {
			description: formData.get('description')?.toString().trim() || ''
		};

		if (!values.description) {
			return fail(400, {
				...warningResponse('Isi Kurikulum OBE tidak boleh kosong.', 'Validasi Gagal'),
				values
			});
		}

		try {
			await saveOrUpdateObeCurriculum(values.description);

			return successResponse('Berhasil menyimpan data Kurikulum OBE!', 'Berhasil');
		} catch (err: any) {
			console.error('Error saving OBE curriculum:', err);

			return fail(500, {
				...errorResponse('Gagal menyimpan data Kurikulum OBE.', 'Kesalahan Server'),
				values
			});
		}
	}
};
