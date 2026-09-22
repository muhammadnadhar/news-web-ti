import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	createPartnership,
	deletePartnership,
	getAllPartnerships,
	updatePartnership
} from '$lib/repository/admin/article/kerjasama/daftar';
import { errorResponse, successResponse } from '$lib/helper/message';

export const load: PageServerLoad = async () => {
	try {
		// const rawList = await getAllPartnerships();

		// Transformasi data DB ke format TableContentType untuk komponen TableContent
		// const partnershipList: TableContentType[] = rawList.map((item) => ({
		// 	id: item.id,
		// 	items: [
		// 		{
		// 			colomn: 'Nama',
		// 			row: item.institution_name
		// 		},
		// 		{
		// 			colomn: 'Foto',
		// 			row: item.logo_url ? `<img src="${item.logo_url}" alt="${item.institution_name}" class="h-12 w-12 object-contain rounded-lg bg-white p-1" />` : '-'
		// 		}
		// 	]
		// }));

		return {
			// partnershipList,
			rawPartnershipList: getAllPartnerships()
		};
	} catch (err) {
		console.error('Error loading partnerships:', err);
		throw error(500, 'Gagal mengambil data Daftar Kerjasama.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const institutionName = formData.get('institution_name') as string;
		const logoUrl = formData.get('logo_url') as string;

		if (!institutionName || institutionName.trim() === '') {
			return fail(400, errorResponse('Nama Instansi / Mitra wajib diisi.', 'Validasi Gagal'));
		}

		try {
			if (isEdit) {
				await updatePartnership(id, institutionName, logoUrl);
			} else {
				await createPartnership(id, institutionName, logoUrl);
			}

			return successResponse(
				`Data Daftar Kerjasama berhasil ${isEdit ? 'diperbarui' : 'disimpan'}.`,
				'Berhasil'
			);
		} catch (err) {
			console.error('Error saving partnership:', err);

			return fail(500, errorResponse('Gagal menyimpan data Daftar Kerjasama.', 'Kesalahan Sistem'));
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		// Validasi ID
		if (!id) {
			return fail(400, errorResponse('ID tidak valid.', 'Gagal'));
		}

		try {
			await deletePartnership(id);

			//  Success Response
			return successResponse('Data Daftar Kerjasama berhasil dihapus.', 'Berhasil');
		} catch (err) {
			console.error('Error deleting partnership:', err);

			//  Error Response Sistem
			return fail(500, errorResponse('Gagal menghapus data Daftar Kerjasama.', 'Kesalahan Sistem'));
		}
	}
};
