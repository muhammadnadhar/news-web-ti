import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getLecturerResearch,
	saveOrUpdateLecturerResearch
} from '$lib/repository/admin/article/penelitian/penelitianDosen';
import type { ResponseMessage } from '$lib/types/message';

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
			const resData: ResponseMessage = {
				status: 'error',
				title: 'Gagal',
				message: 'Isi Penelitian Dosen tidak boleh kosong.'
			};
			return fail(400, resData);
		}

		try {
			await saveOrUpdateLecturerResearch(description);

			const resData: ResponseMessage = {
				status: 'success',
				title: 'Berhasil',
				message: 'Data Penelitian Dosen berhasil disimpan.'
			};
			return resData;
		} catch (err) {
			console.error('Error saving lecturer research:', err);

			const resData: ResponseMessage = {
				status: 'error',
				title: 'Gagal',
				message: 'Gagal menyimpan data Penelitian Dosen.'
			};
			return fail(500, resData);
		}
	}
};
