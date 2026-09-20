import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import crypto from 'crypto';
import { errorResponse, successResponse } from '$lib/helper/message';
import { createStudentPublication } from '$lib/repository/admin/article/penelitian/publikasiMahasiswa';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const student_name = (formData.get('student_name') as string)?.trim();
		const journal_list = (formData.get('journal_list') as string)?.trim();

		// Validasi field wajib
		if (!student_name) {
			return fail(400, {
				...errorResponse('Nama mahasiswa wajib diisi.', 'Validasi Gagal'),
				values: { student_name, journal_list }
			});
		}

		if (!journal_list) {
			return fail(400, {
				...errorResponse('Daftar jurnal wajib diisi.', 'Validasi Gagal'),
				values: { student_name, journal_list }
			});
		}

		try {
			const id = crypto.randomUUID();

			await createStudentPublication(id, student_name, journal_list);

			return successResponse('Data publikasi mahasiswa berhasil ditambahkan.');
		} catch (err: any) {
			console.error('Error adding student publication:', err);
			return fail(500, {
				...errorResponse('Gagal menyimpan data publikasi mahasiswa.'),
				values: { student_name, journal_list }
			});
		}
	}
};
