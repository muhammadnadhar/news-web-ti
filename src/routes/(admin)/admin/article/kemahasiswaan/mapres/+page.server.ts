import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	createStudentAchievement,
	deleteStudentAchievement,
	getAllStudentAchievements,
	getPublicIdStudentAchievementsById,
	updateStudentAchievement
} from '$lib/repository/admin/article/kemahasiswaan/mapres';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

export const load: PageServerLoad = async () => {
	try {
		// const rawList = await getAllStudentAchievements();

		// const achievementList: TableContentType[] = rawList.map((item) => ({
		// 	id: item.id,
		// 	items: [
		// 		{
		// 			colomn: 'Nama',
		// 			row: item.student_name
		// 		},
		// 		{
		// 			colomn: 'Kategori',
		// 			row: item.is_academic === 'y' ? 'Akademik' : 'Non-Akademik'
		// 		},
		// 		{
		// 			colomn: 'Angkatan',
		// 			row: item.batch_year
		// 		},
		// 		{
		// 			colomn: 'Semester',
		// 			row: item.semester
		// 		},
		// 		{
		// 			colomn: 'Prestasi',
		// 			row: item.achievement_name
		// 		}
		// 	]
		// }));

		return {
			rawAchievementList: getAllStudentAchievements()
		};
	} catch (err) {
		console.error('Error loading student achievements:', err);
		throw error(500, 'Gagal mengambil data Mahasiswa Prestasi.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const studentName = formData.get('student_name') as string;
		const isAcademic = (formData.get('is_academic') as 'y' | 'n') || 'y';
		const batchYear = formData.get('batch_year') as string;
		const semester = formData.get('semester') as string;
		const achievementName = formData.get('achievement_name') as string;
		const imageUrl = formData.get('image_url') as string;

		if (!studentName || !batchYear || !semester || !achievementName) {
			return fail(400, { message: 'Semua kolom form wajib diisi.' });
		}
		if (!imageUrl || imageUrl.trim().length < 0) {
			return fail(400, errorResponse('Membutuhkan Gambar', 'gagal'));
		}

		try {
			if (isEdit) {
				await updateStudentAchievement(
					id,
					studentName,
					isAcademic,
					batchYear,
					semester,
					achievementName,
					imageUrl
				);
			} else {
				await createStudentAchievement(
					id,
					studentName,
					isAcademic,
					batchYear,
					semester,
					achievementName,
					imageUrl
				);
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving student achievement:', err);
			return fail(500, { message: 'Gagal menyimpan data Mahasiswa Prestasi.' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString().trim();

		if (!id) {
			return fail(400, warningResponse('ID Prestasi Mahasiswa wajib disertakan.', 'Gagal'));
		}

		try {
			//  Ambil image_public_id menggunakan method ringan
			const imagePublicId = await getPublicIdStudentAchievementsById(id);

			if (imagePublicId) {
				await deleteImageFromCloudinary(imagePublicId);
			}

			const isSuccess = await deleteStudentAchievement(id);

			if (!isSuccess) {
				return fail(
					404,
					warningResponse('Data prestasi tidak ditemukan atau sudah dihapus.', 'Gagal')
				);
			}

			return successResponse('Data Prestasi Mahasiswa berhasil dihapus.', 'Berhasil');
		} catch (err: any) {
			console.error('Error deleting student achievement:', err);
			return fail(
				500,
				errorResponse(
					'Terjadi kesalahan sistem saat menghapus data Prestasi Mahasiswa.',
					'Kesalahan Sistem'
				)
			);
		}
	}
};
