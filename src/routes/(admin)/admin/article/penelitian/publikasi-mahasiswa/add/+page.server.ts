import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { createStudentPublication } from '$lib/repository/admin/article/penelitian/publikasiMahasiswa';
import { randomUUID } from '$lib/crypto';
import type { StudentPublicationFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const values: StudentPublicationFormValues = {
			student_name: (formData.get('student_name') as string)?.trim() || '',
			journal_list: (formData.get('journal_list') as string)?.trim() || ''
		};

		if (!values.student_name) {
			return fail(400, {
				...warningResponse('Nama mahasiswa wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (!values.journal_list) {
			return fail(400, {
				...warningResponse('Daftar jurnal wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const id = randomUUID();

			await createStudentPublication(id, values.student_name, values.journal_list);

			return successResponse('Data publikasi mahasiswa berhasil ditambahkan.', 'Berhasil');
		} catch (err: any) {
			console.error('Error adding student publication:', err);

			return fail(500, {
				...errorResponse('Gagal menyimpan data publikasi mahasiswa.', 'Kesalahan Server'),
				values
			});
		}
	}
};
