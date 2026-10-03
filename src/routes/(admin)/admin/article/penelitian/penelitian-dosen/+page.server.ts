import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getLecturerResearch,
	saveOrUpdateLecturerResearch
} from '$lib/repository/admin/article/penelitian/penelitianDosen';
import type { LecturerResearchFormValues } from '$lib/types/values/admin/article';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';

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

		const values: LecturerResearchFormValues = {
			description: formData.get('description')?.toString().trim() || ''
		};

		if (!values.description) {
			return fail(400, {
				...warningResponse('Isi Penelitian Dosen tidak boleh kosong.', 'Validasi Gagal'),
				values
			});
		}

		try {
			await saveOrUpdateLecturerResearch(values.description);

			return successResponse('Data Penelitian Dosen berhasil disimpan.', 'Berhasil');
		} catch (err: any) {
			console.error('Error saving lecturer research:', err);

			return fail(500, {
				...errorResponse('Gagal menyimpan data Penelitian Dosen.', 'Kesalahan Server'),
				values
			});
		}
	}
};
