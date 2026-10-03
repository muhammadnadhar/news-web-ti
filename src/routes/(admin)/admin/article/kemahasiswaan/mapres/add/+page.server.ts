import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createStudentAchievement } from '$lib/repository/admin/article/kemahasiswaan/mapres';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import type { PageServerLoad } from '../$types';
import { getAllSemesters } from '$lib/repository/admin/dataset/semester';
import { getAllAngkatan } from '$lib/repository/admin/dataset/angkatan';
import type { MapresFormValues } from '$lib/types/values/admin/article';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

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

		const isAcademicRaw = formData.get('is_academic')?.toString().trim();

		const values: MapresFormValues = {
			student_name: formData.get('student_name')?.toString().trim() || '',
			is_academic: isAcademicRaw || 'y',
			batch_year:
				formData.get('batch_year')?.toString().trim() ||
				formData.get('angkatan_id')?.toString().trim() ||
				'',
			semester:
				formData.get('semester')?.toString().trim() ||
				formData.get('semester_id')?.toString().trim() ||
				'',
			achievement_name: formData.get('achievement_name')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			image_public_id:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null
		};

		// console.log({ studentName: values.student_name, isAcademic: values.is_academic, angkatanId: values.batch_year, semesterId: values.semester, achievementName: values.achievement_name, imageUrl: values.image_url });

		if (
			!values.student_name ||
			!values.is_academic ||
			!values.batch_year ||
			!values.semester ||
			!values.achievement_name
		) {
			return fail(400, {
				...warningResponse('Harap isi semua bidang form yang wajib (*).', 'Gagal Menyimpan'),
				values
			});
		}

		if (!values.image_url) {
			return fail(400, {
				...warningResponse('Gambar wajib diunggah/diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (values.is_academic !== 'y' && values.is_academic !== 'n') {
			return fail(400, {
				...warningResponse(
					'Jenis prestasi harus berupa Akademik (y) atau Non-Akademik (n).',
					'Validasi Gagal'
				),
				values
			});
		}

		const id = crypto.randomUUID();

		try {
			await createStudentAchievement(
				id,
				values.student_name,
				values.is_academic as 'y' | 'n',
				values.batch_year,
				values.semester,
				values.achievement_name,
				values.image_url,
				values.image_public_id
			);

			return {
				...successResponse('Data Prestasi Mahasiswa berhasil disimpan!', 'Success'),
				values
			};
		} catch (err: any) {
			console.error('Error creating student achievement:', err);

			return fail(500, {
				...errorResponse(
					`Gagal menyimpan data Prestasi Mahasiswa ke database: ${err?.message || 'Kesalahan tidak diketahui'}`,
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
			await deleteImageFromCloudinary(publicId);
			return successResponse('Berhasil di batalkan', 'Succcess');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto ', 'Gagal'));
		}
	}
};
