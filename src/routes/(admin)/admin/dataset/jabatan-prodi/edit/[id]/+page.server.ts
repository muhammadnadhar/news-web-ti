import { error, fail, type Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import type { ResponseMessage } from '$lib/types/message';
import {
	getJabatanProdiById,
	updateJabatanProdi
} from '$lib/repository/admin/dataset/jabatanProdi';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const position = await getJabatanProdiById(id);

	if (!position) {
		throw error(404, 'Data Jabatan Prodi tidak ditemukan.');
	}

	return { position };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const id = params.id;
		const name = formData.get('name')?.toString().trim();

		if (!id || !name) {
			const errRes: ResponseMessage = {
				status: 'error',
				title: 'Validasi Gagal',
				message: 'ID dan Nama Jabatan Prodi wajib diisi.'
			};
			return fail(400, { ...errRes, values: { name } });
		}

		try {
			await updateJabatanProdi(id, name);
			const successRes: ResponseMessage = {
				status: 'success',
				title: 'Berhasil',
				message: 'Data Jabatan Prodi berhasil diperbarui!'
			};
			return successRes;
		} catch (err: any) {
			console.error('Error updating Jabatan Prodi:', err);
			const sysErrRes: ResponseMessage = {
				status: 'error',
				title: 'Gagal Memperbarui',
				message: err.message || 'Terjadi kesalahan saat memperbarui data di database.'
			};
			return fail(500, { ...sysErrRes, values: { name } });
		}
	}
};
