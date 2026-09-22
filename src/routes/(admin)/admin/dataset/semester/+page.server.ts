import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

import type { ResponseMessage } from '$lib/types/message';
import { deleteSemester, getAllSemesters } from '$lib/repository/admin/dataset/semester';
import { errorResponse, successResponse } from '$lib/helper/message';

export const load: PageServerLoad = async () => {
	try {
		return {
			// courseMapList,
			rawSmtList: getAllSemesters() // lazy streaming sveltekit
		};
	} catch (err) {
		console.error('Error loading course map:', err);
		throw error(500, 'Gagal mengambil data Peta Mata Kuliah.');
	}
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) {
			return fail(400, errorResponse('ID data tidak valid.', 'Gagal'));
		}

		try {
			// Hapus data...
			await deleteSemester(id.toString());

			// Mengembalikan ResponseMessage pada kondisi Success

			// Menggunakan helper successResponse
			return successResponse('Data berhasil dihapus dari sistem.', 'Berhasil');
		} catch (err: any) {
			// Menggunakan helper errorResponse di dalam fail()
			return fail(500, errorResponse(err.message || 'Terjadi kesalahan database.', 'Gagal'));
		}
	}
};
