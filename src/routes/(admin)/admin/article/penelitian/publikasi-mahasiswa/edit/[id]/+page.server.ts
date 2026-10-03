import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import {
	getstudentpublicationbyid,
	updateStudentPublication
} from '$lib/repository/admin/article/penelitian/publikasiMahasiswa';
import type { StudentPublicationFormValues } from '$lib/types/values/admin/article';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		const data = await getstudentpublicationbyid(id);

		return {
			studentPublication: data
		};
	} catch (err: any) {
		if (err.status === 404) throw err;
		// console.error('Error fetching student publication:', err);
		// throw error(500, 'Gagal mengambil data publikasi mahasiswa.');
		return errorResponse('Gagal mengambil data publikasi mahasiswa.', 'Kesalahan Sistem');
	}
};

// Menangani aksi UPDATE
export const actions: Actions = {
	default: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		const values: StudentPublicationFormValues = {
			id,
			student_name: (formData.get('student_name') as string)?.trim() || '',
			journal_list: (formData.get('journal_list') as string)?.trim() || ''
		};

		if (!id) {
			return fail(400, {
				...errorResponse('ID Publikasi Mahasiswa tidak ditemukan di URL.', 'Validasi Gagal')
			});
		}

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
			await updateStudentPublication(id, values.student_name, values.journal_list);

			return successResponse('Data publikasi mahasiswa berhasil diperbarui.', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating student publication:', err);

			return fail(500, {
				...errorResponse('Gagal memperbarui data publikasi mahasiswa.', 'Kesalahan Server'),
				values
			});
		}
	}
};
