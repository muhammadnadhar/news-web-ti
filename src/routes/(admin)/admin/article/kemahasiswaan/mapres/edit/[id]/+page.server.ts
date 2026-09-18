// src/routes/admin/prestasi/[id]/edit/+page.server.ts
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getStudentAchievementById,
	updateStudentAchievement
} from '$lib/server/admin/repository/article/kemahasiswaan/mapres';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		// Mock Data untuk simulasi:
		// const prestasi = {
		// 	id,
		// 	studentName: 'Budi Santoso',
		// 	achievementName: 'Juara 1 Lomba Karya Tulis Ilmiah Nasional (LKTIN) 2026',
		// 	isAcademic: 'y',
		// 	batchYear: '2023',
		// 	semester: 'Semester Ganjil 2025/2026'
		// };
		const prestasi = await getStudentAchievementById(id);
		if (!prestasi) {
			throw error(404, 'Data prestasi tidak ditemukan');
		}

		return {
			prestasi
		};
	} catch (e) {
		throw error(404, 'Data prestasi tidak ditemukan');
	}
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		const studentName = formData.get('student_name')?.toString().trim();
		const achievementName = formData.get('achievement_name')?.toString().trim();
		const isAcademic = formData.get('is_academic')?.toString() || 'y';
		const batchYear = formData.get('batch_year')?.toString().trim();
		const semester = formData.get('semester')?.toString().trim();

		const values = {
			studentName,
			achievementName,
			isAcademic,
			batchYear,
			semester
		};

		// Validasi Sederhana
		if (!studentName || !achievementName || !batchYear || !semester) {
			return fail(400, {
				title: 'Validasi Gagal',
				message: 'Mohon lengkapi semua bidang yang wajib diisi.',
				values
			});
		}

		try {
			// TODO: Jalankan query update ke database Anda
			// await db.prestasi.update({ where: { id }, data: { ... } });
			await updateStudentAchievement(
				id,
				studentName,
				isAcademic ? 'y' : 'n',
				batchYear,
				semester,
				achievementName
			);

			return {
				success: true,
				title: 'Berhasil Diperbarui',
				message: `Data prestasi "${achievementName}" milik ${studentName} berhasil diperbarui.`,
				values
			};
		} catch (err) {
			return fail(500, {
				title: 'Gagal Menyimpan',
				message: 'Terjadi kesalahan sistem saat memperbarui data.',
				values
			});
		}
	}
};
