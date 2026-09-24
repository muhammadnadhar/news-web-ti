import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createStudentAchievement } from '$lib/repository/admin/article/kemahasiswaan/mapres';
import { errorResponse, successResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import type { PageServerLoad } from '../$types';
import { getAllSemesters } from '$lib/repository/admin/dataset/semester';
import { getAllAngkatan } from '$lib/repository/admin/dataset/angkatan';
import { cloudinary } from '$lib/cloudinary/server';

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
	create: async ({ request }) => {
		const formData = await request.formData();

		const studentName = formData.get('student_name')?.toString().trim();
		const isAcademic = formData.get('is_academic')?.toString().trim();
		const angkatanId = formData.get('angkatan_id')?.toString().trim();
		const semesterId = formData.get('semester_id')?.toString().trim();
		const achievementName = formData.get('achievement_name')?.toString().trim();
		const imageUrl = formData.get('image_url')?.toString().trim();

		// console.log({ studentName, isAcademic, angkatanId, semesterId, achievementName, imageUrl });

		const values = {
			studentName,
			isAcademic: isAcademic || 'y',
			angkatanId,
			semesterId,
			achievementName,
			imageUrl
		};

		//  Validasi Field Wajib
		if (!studentName || !isAcademic || !angkatanId || !semesterId || !achievementName) {
			return fail(400, {
				...errorResponse('Harap isi semua bidang form yang wajib (*).', 'Gagal Menyimpan'),
				values
			});
		}

		//  Validasi Keberadaan Gambar
		if (!imageUrl || imageUrl.length === 0) {
			return fail(400, {
				...errorResponse('Gambar wajib diunggah/diisi.', 'Validasi Gagal'),
				values
			});
		}

		//  Validasi Jenis Prestasi
		if (isAcademic !== 'y' && isAcademic !== 'n') {
			return fail(400, {
				...errorResponse(
					'Jenis prestasi harus berupa Akademik (y) atau Non-Akademik (n).',
					'Validasi Gagal'
				),
				values
			});
		}

		const id = randomUUID();

		try {
			await createStudentAchievement(
				id,
				studentName,
				isAcademic as 'y' | 'n',
				angkatanId,
				semesterId,
				achievementName,
				imageUrl
			);

			return successResponse('Data Prestasi Mahasiswa berhasil disimpan!', 'Success');
		} catch (err) {
			console.error('Error creating student achievement:', err);

			return fail(500, {
				...errorResponse(
					'Gagal menyimpan data Prestasi Mahasiswa ke database.',
					'Kesalahan Sistem'
				),
				values
			});
		}
	},
	// url action untuk Gambar yang di batalin akan mengguanka url ini , karena
	// cloudinary akan meng upload duluan ke cloud nya
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

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
