import { fail, type Actions } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import type { ResponseMessage } from '$lib/types/message';
import { createJabatanProdi } from '$lib/server/admin/repository/dataset/jabatanProdi';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();

		if (!name) {
			const errRes: ResponseMessage = {
				status: 'error',
				title: 'Validasi Gagal',
				message: 'Nama Jabatan Prodi wajib diisi.'
			};
			return fail(400, { ...errRes, values: { name } });
		}

		try {
			await createJabatanProdi(randomUUID(), name);
			const successRes: ResponseMessage = {
				status: 'success',
				title: 'Berhasil',
				message: 'Jabatan Prodi baru berhasil ditambahkan!'
			};
			return successRes;
		} catch (err: any) {
			console.error('Error creating Jabatan Prodi:', err);
			const sysErrRes: ResponseMessage = {
				status: 'error',
				title: 'Gagal Menyimpan',
				message: err.message || 'Terjadi kesalahan saat menyimpan data ke database.'
			};
			return fail(500, { ...sysErrRes, values: { name } });
		}
	}
};
