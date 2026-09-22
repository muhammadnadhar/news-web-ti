import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createStudentAchievement } from '$lib/repository/admin/article/kemahasiswaan/mapres';
import { errorResponse, successResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';

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
				...errorResponse('Harap isi semua bidang form yang wajib (*).', 'Gagal Menyimpan'),
				values
			});
		}

		// 2. Validasi Keberadaan Gambar
		if (!imageUrl || imageUrl.trim().length === 0) {
			// Diperbaiki dari < 0 menjadi === 0 karena panjang string minimal 0
			return fail(400, {
				...errorResponse('Gambar Wajib ada', 'Gagal'),
				values
			});
		}

		// 3. Validasi Jenis Prestasi
		if (isAcademic !== 'y' && isAcademic !== 'n') {
			return fail(400, {
				...errorResponse(
					'Jenis prestasi harus berupa Akademik atau Non-Akademik.',
					'Validasi Gagal'
				),
				values
			});
		}
		const id = randomUUID();

		if (!studentName || !isAcademic || !batchYear || !semester || !achievementName) {
			return fail(400, {
				...errorResponse('Harap isi semua bidang form yang wajib (*).', 'Gagal Menyimpan'),
				values
			});
		}

		// 2. Validasi Keberadaan Gambar
		if (!imageUrl || imageUrl.trim().length === 0) {
			// Diperbaiki dari < 0 menjadi === 0 karena panjang string minimal 0
			return fail(400, {
				...errorResponse('Gambar Wajib ada', 'Gagal'),
				values
			});
		}

		// 3. Validasi Jenis Prestasi
		if (isAcademic !== 'y' && isAcademic !== 'n') {
			return fail(400, {
				...errorResponse(
					'Jenis prestasi harus berupa Akademik atau Non-Akademik.',
					'Validasi Gagal'
				),
				values
			});
		}

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

			return fail(
				500,
				errorResponse('Gagal menyimpan data Prestasi Mahasiswa ke database.', 'Kesalahan Sistem')
			);
		}
	}
};
