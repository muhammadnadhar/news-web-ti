import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse } from '$lib/helper/message';
import {
	getstudentpublicationbyid,
	updateStudentPublication
} from '$lib/repository/admin/article/penelitian/publikasiMahasiswa';

// Fetch data berdasarkan ID untuk dimasukkan ke dalam form edit
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

		const student_name = (formData.get('student_name') as string)?.trim();
		const journal_list = (formData.get('journal_list') as string)?.trim();

		// Validasi input
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
			await updateStudentPublication(id, student_name, journal_list);

			return successResponse('Data publikasi mahasiswa berhasil diperbarui.');
		} catch (err: any) {
			console.error('Error updating student publication:', err);
			return fail(500, {
				...errorResponse('Gagal memperbarui data publikasi mahasiswa.'),
				values: { student_name, journal_list }
			});
		}
	}
};
