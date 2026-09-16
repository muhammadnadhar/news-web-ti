import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createHighGpaStudent } from '$lib/server/admin/repository/article/kemahasiswaan/ipkTertinggi';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const studentName = formData.get('student_name')?.toString().trim();
		const gpaRaw = formData.get('gpa')?.toString().trim();
		const batchYear = formData.get('batch_year')?.toString().trim();
		const semester = formData.get('semester')?.toString().trim();

		const gpa = gpaRaw ? parseFloat(gpaRaw) : NaN;

		const values = {
			studentName,
			gpa: gpaRaw,
			batchYear,
			semester
		};

		// 1. Validasi Input Wajib
		if (!studentName || !gpaRaw || !batchYear || !semester) {
			return fail(400, {
				success: false,
				title: 'Gagal Menyimpan',
				message: 'Harap isi semua bidang form yang wajib (*).',
				values
			});
		}

		// 2. Validasi Nilai IPK (0.00 - 4.00)
		if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
			return fail(400, {
				success: false,
				title: 'Validasi IPK Gagal',
				message: 'Nilai IPK harus berupa angka rentang 0.00 hingga 4.00.',
				values
			});
		}

		const id = crypto.randomUUID();

		try {
			await createHighGpaStudent(id, studentName, gpa, batchYear, semester);

			return {
				success: true,
				title: 'Berhasil',
				message: 'Data Mahasiswa IPK Tertinggi berhasil disimpan!'
			};
		} catch (err) {
			console.error('Error creating high GPA student:', err);
			return fail(500, {
				success: false,
				title: 'Kesalahan Sistem',
				message: 'Gagal menyimpan data Mahasiswa IPK Tertinggi ke database.',
				values
			});
		}
	}
};
