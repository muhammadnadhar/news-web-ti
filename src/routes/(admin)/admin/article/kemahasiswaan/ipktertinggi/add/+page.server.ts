import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createHighGpaStudent } from '$lib/server/admin/repository/article/kemahasiswaan/ipkTertinggi';
import { getAllAngkatan } from '$lib/server/admin/repository/dataset/angkatan';
import { getAllSemesters } from '$lib/server/admin/repository/dataset/semester';

export const load: PageServerLoad = async () => {
	try {
		const [angkatanList, semesterList] = await Promise.all([getAllAngkatan(), getAllSemesters()]);

		return {
			angkatanList: angkatanList || [],
			semesterList: semesterList || []
		};
	} catch (error) {
		console.error('Error loading references:', error);
		return {
			angkatanList: [],
			semesterList: []
		};
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const studentName = formData.get('student_name')?.toString().trim();
		const gpaRaw = formData.get('gpa')?.toString().trim();
		const angkatanId = formData.get('angkatan_id')?.toString().trim();
		const semesterId = formData.get('semester_id')?.toString().trim();
		const imgUrl = formData.get('img_url')?.toString().trim() || '';

		const gpa = gpaRaw ? parseFloat(gpaRaw) : NaN;

		const values = {
			studentName,
			gpa: gpaRaw,
			angkatanId,
			semesterId,
			imgUrl
		};

		// 1. Validasi Input Wajib
		if (!studentName || !gpaRaw || !angkatanId || !semesterId) {
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
			await createHighGpaStudent(id, studentName, gpa, angkatanId, semesterId, imgUrl);

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
