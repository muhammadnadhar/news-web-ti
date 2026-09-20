import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createStudentAchievement } from '$lib/repository/admin/article/kemahasiswaan/mapres';
import { errorResponse, successResponse } from '$lib/helper/message';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const studentName = formData.get('student_name')?.toString().trim();
		const isAcademic = formData.get('is_academic')?.toString().trim();
		const batchYear = formData.get('batch_year')?.toString().trim();
		const semester = formData.get('semester')?.toString().trim();
		const achievementName = formData.get('achievement_name')?.toString().trim();
		const imageUrl = formData.get('image_url')?.toString().trim();

		const values = {
			studentName,
			isAcademic: isAcademic || 'y',
			batchYear,
			semester,
			achievementName
		};

		if (!studentName || !isAcademic || !batchYear || !semester || !achievementName) {
			return fail(400, {
				success: false,
				title: 'Gagal Menyimpan',
				message: 'Harap isi semua bidang form yang wajib (*).',
				values
			});
		}
		if (!imageUrl || imageUrl.trim().length < 0) {
			return fail(400, errorResponse('Gambar Wajib ada', 'Gagal'));
		}

		//  Validasi Jenis Prestasi
		if (isAcademic !== 'y' && isAcademic !== 'n') {
			return fail(400, {
				success: false,
				title: 'Validasi Gagal',
				message: 'Jenis prestasi harus berupa Akademik atau Non-Akademik.',
				values
			});
		}

		const id = crypto.randomUUID();

		try {
			await createStudentAchievement(
				id,
				studentName,
				isAcademic as 'y' | 'n',
				batchYear,
				semester,
				achievementName,
				imageUrl
			);

			return successResponse('Data Prestasi Mahasiswa berhasil disimpan!', 'Success');
		} catch (err) {
			console.error('Error creating student achievement:', err);
			return fail(500, {
				success: false,
				title: 'Kesalahan Sistem',
				message: 'Gagal menyimpan data Prestasi Mahasiswa ke database.',
				values
			});
		}
	}
};
