import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getAllAngkatan,
	createAngkatan,
	updateAngkatan,
	deleteAngkatan
} from '$lib/server/admin/repository/dataset/angkatan';
import type { TableContentType } from '$lib/types/tableContent';
export const load: PageServerLoad = async () => {
	try {
		const rawAngkatanList = await getAllAngkatan();

		// Transformasi data DB ke format TableContentType yang dibutuhkan komponen UI
		const angkatanList: TableContentType[] = rawAngkatanList.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Nama',
					row: item.year.toString()
				}
			]
		}));

		return {
			angkatanList,
		};
	} catch (err) {
		console.error('Error loading angkatan data:', err);
		throw error(500, 'Gagal mengambil data Angkatan dari server.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const yearInput = formData.get('year') as string;

		if (!yearInput) {
			return fail(400, { message: 'Tahun angkatan wajib diisi.' });
		}

		const year = parseInt(yearInput, 10);
		if (isNaN(year)) {
			return fail(400, { message: 'Format tahun tidak valid.' });
		}

		try {
			if (isEdit) {
				await updateAngkatan(id, year);
			} else {
				await createAngkatan(id, year);
			}
			return { success: true };
		} catch (err: any) {
			console.error('Error saving angkatan:', err);
			if (err?.code === 'ER_DUP_ENTRY') {
				return fail(400, { message: 'Tahun angkatan tersebut sudah ada.' });
			}
			return fail(500, { message: 'Gagal menyimpan data angkatan.' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { message: 'ID tidak valid.' });

		try {
			await deleteAngkatan(id);
			return { success: true };
		} catch (err) {
			console.error('Error deleting angkatan:', err);
			return fail(500, { message: 'Gagal menghapus data angkatan.' });
		}
	}
};
