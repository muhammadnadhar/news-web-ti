// src/routes/admin/prestasi/[id]/edit/+page.server.ts
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getStudentAchievementById,
	updateStudentAchievement
} from '$lib/repository/admin/article/kemahasiswaan/mapres';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { getAllSemesters } from '$lib/repository/admin/dataset/semester';
import { getAllAngkatan } from '$lib/repository/admin/dataset/angkatan';
import { cloudinary } from '$lib/cloudinary/server';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { MapresFormValues } from '$lib/types/values/admin/article';

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
		const id =
			params.id || (await request.clone().formData()).get('id')?.toString().trim() || undefined;
		const formData = await request.formData();

		const values: MapresFormValues = {
			id,
			student_name: formData.get('student_name')?.toString().trim() || '',
			achievement_name: formData.get('achievement_name')?.toString().trim() || '',
			is_academic: formData.get('is_academic')?.toString().trim() || 'y',
			batch_year: formData.get('batch_year')?.toString().trim() || '',
			semester: formData.get('semester')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			image_public_id:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null
		};

		if (!values.id) {
			return fail(400, {
				...warningResponse('ID data prestasi tidak ditemukan.', 'Gagal'),
				values
			});
		}

		if (
			!values.student_name ||
			!values.achievement_name ||
			!values.batch_year ||
			!values.semester
		) {
			return fail(400, {
				...warningResponse('Mohon lengkapi semua bidang yang wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (!values.image_url) {
			return fail(400, {
				...warningResponse('Butuhkan Gambar / Foto Prestasi.', 'Error'),
				values
			});
		}

		try {
			// TODO: Jalankan query update ke database Anda
			// await db.prestasi.update({ where: { id }, data: { ... } });
			await updateStudentAchievement(
				values.id,
				values.student_name,
				values.is_academic,
				values.batch_year,
				values.semester,
				values.achievement_name,
				values.image_url,
				values.image_public_id
			);

			return {
				...successResponse(
					`Data prestasi "${values.achievement_name}" milik ${values.student_name} berhasil diperbarui.`,
					'Berhasil Diperbarui'
				),
				values
			};
		} catch (err: any) {
			console.error('Error updating student achievement:', err);
			return fail(500, {
				...errorResponse(
					`Terjadi kesalahan sistem saat memperbarui data: ${err?.message || 'Kesalahan tidak diketahui'}`,
					'Gagal Menyimpan'
				),
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
			await deleteImageFromCloudinary(publicId);
			return successResponse('Berhasil di batalkan', 'Succcess');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto ', 'Gagal'));
		}
	}
};
