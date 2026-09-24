// src/routes/admin/prestasi/[id]/edit/+page.server.ts
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getStudentAchievementById,
	updateStudentAchievement
} from '$lib/repository/admin/article/kemahasiswaan/mapres';
import { errorResponse, successResponse } from '$lib/helper/message';
import { getAllSemesters } from '$lib/repository/admin/dataset/semester';
import { getAllAngkatan } from '$lib/repository/admin/dataset/angkatan';
import { cloudinary } from '$lib/cloudinary/server';

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
		// const prestasi = await getStudentAchievementById(id);

		const [angkatanList, semesterList, prestasi] = await Promise.all([
			getAllAngkatan(),
			getAllSemesters(),
			getStudentAchievementById(id)
		]);

		if (!prestasi) {
			throw error(404, 'Data prestasi tidak ditemukan');
		}

		return {
			prestasi,

			angkatanList: angkatanList || [],
			semesterList: semesterList || []
		};
	} catch (e) {
		throw error(404, 'Data prestasi tidak ditemukan');
	}
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		const studentName = formData.get('student_name')?.toString().trim();
		const achievementName = formData.get('achievement_name')?.toString().trim();
		const isAcademic = formData.get('is_academic')?.toString() || 'y';
		const batchYear = formData.get('batch_year')?.toString().trim();
		const semester = formData.get('semester')?.toString().trim();
		const imageUrl = formData.get('image_url')?.toString().trim();

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

		if (!imageUrl) {
			return fail(400, errorResponse('Buuhkan Gambar', 'Error'));
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
				achievementName,
				imageUrl
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
	},
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		console.info('deleted', publicId);

		if (!publicId) {
			return fail(400, errorResponse('Public Id tidak di temukan', 'Error'));
		}

		try {
			await cloudinary.uploader.destroy(publicId);
			return successResponse('Berhasil di batalkan', 'Succcess');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto ', 'Gagal'));
		}
	}
};
