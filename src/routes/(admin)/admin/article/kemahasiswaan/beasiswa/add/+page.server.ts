import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createScholarship } from '$lib/repository/admin/article/kemahasiswaan/beasiswa';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const studentName = formData.get('student_name') as string;
		const scholarshipName = formData.get('scholarship_name') as string;
		const imageUrl = (formData.get('image_url') as string) || null;

		// Validasi input wajib
		if (!studentName || studentName.trim() === '') {
			return fail(400, warningResponse('Nama Mahasiswa wajib diisi.', 'Warnig'));
		}

		if (!imageUrl || imageUrl.trim() === '') {
			return fail(400, warningResponse('Foto Wajib di Isi', 'Image warning'));
		}

		if (!scholarshipName || scholarshipName.trim() === '') {
			return fail(400, warningResponse('Nama Beasiswa wajib di isi', 'Gagal '));
		}

		// Generate UUID unik untuk Primary Key
		const id = randomUUID();

		try {
			const success = await createScholarship(id, studentName, scholarshipName, imageUrl);

			if (!success) {
				return fail(422, errorResponse('Gagal menyimpan data Penerima Beasiswa ke', 'Gagal'));
			}
		} catch (error: any) {
			return fail(500, errorResponse('Terjadi Kesalahan pada System', 'Error'));
		}

		// Redirect ke halaman daftar Beasiswa Kemahasiswaan
		// throw redirect(303, '/admin/kemahasiswaan/beasiswa');
		return successResponse('Berhasil menyimpan data mahasiswa Baru', 'Success');
	}
};
