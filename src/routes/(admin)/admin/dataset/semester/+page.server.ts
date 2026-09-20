import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

import type { ResponseMessage } from '$lib/types/message';
import { deleteSemester, getAllSemesters } from '$lib/repository/admin/dataset/semester';

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
			// Mengembalikan ResponseMessage pada kondisi Failure
			return fail(400, {
				status: 'error',
				title: 'Gagal',
				message: 'ID data tidak valid.'
			} satisfies ResponseMessage);
		}

		try {
			// Hapus data...
			await deleteSemester(id.toString());

			// Mengembalikan ResponseMessage pada kondisi Success
			return {
				status: 'success',
				title: 'Berhasil',
				message: 'Data berhasil dihapus dari sistem.'
			} satisfies ResponseMessage;
		} catch (err: any) {
			return fail(500, {
				status: 'error',
				title: 'Gagal',
				message: err.message || 'Terjadi kesalahan database.'
			} satisfies ResponseMessage);
		}
	}
};
