import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createScholarship } from '$lib/server/admin/repository/article/kemahasiswaan/beasiswa';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const studentName = formData.get('student_name') as string;
		const scholarshipName = formData.get('scholarship_name') as string;
		const imageUrl = (formData.get('image_url') as string) || null;

		// Validasi input wajib
		if (!studentName || studentName.trim() === '') {
			return fail(400, {
				success: false,
				message: 'Nama Mahasiswa wajib diisi.',
				values: { studentName, scholarshipName, imageUrl }
			});
		}

		if (!scholarshipName || scholarshipName.trim() === '') {
			return fail(400, {
				success: false,
				message: 'Nama Beasiswa wajib diisi.',
				values: { studentName, scholarshipName, imageUrl }
			});
		}

		// Generate UUID unik untuk Primary Key
		const id = crypto.randomUUID();

		try {
			const success = await createScholarship(id, studentName, scholarshipName, imageUrl);

			if (!success) {
				return fail(500, {
					success: false,
					message: 'Gagal menyimpan data Penerima Beasiswa ke database.',
					values: { studentName, scholarshipName, imageUrl }
				});
			}
		} catch (error: any) {
			return fail(500, {
				success: false,
				message: 'Terjadi kesalahan sistem: ' + error.message,
				values: { studentName, scholarshipName, imageUrl }
			});
		}

		// Redirect ke halaman daftar Beasiswa Kemahasiswaan
		throw redirect(303, '/admin/kemahasiswaan/beasiswa');
	}
};
