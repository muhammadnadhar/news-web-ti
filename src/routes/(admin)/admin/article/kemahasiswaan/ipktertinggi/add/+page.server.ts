import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAllAngkatan } from '$lib/repository/admin/dataset/angkatan';
import { getAllSemesters } from '$lib/repository/admin/dataset/semester';
import { createHighGpaStudent } from '$lib/repository/admin/article/kemahasiswaan/ipkTertinggi';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
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
				...warningResponse('Harap isi semua bidang form yang wajib (*).', 'Gagal Menyimpan'),
				values
			});
		}

		//  Validasi Nilai IPK (0.00 - 4.00)
		if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
			return fail(400, {
				...warningResponse(
					'Nilai IPK harus berupa angka rentang 0.00 hingga 4.00.',
					'Validasi IPK Gagal'
				),
				values
			});
		}

		const id = crypto.randomUUID();

		try {
			await createHighGpaStudent(id, studentName, gpa, angkatanId, semesterId, imgUrl);

			// Return langsung untuk success response standar SvelteKit
			return successResponse('Data Mahasiswa IPK Tertinggi berhasil disimpan!', 'Berhasil');
		} catch (err) {
			console.error('Error creating high GPA student:', err);

			return fail(500, {
				...errorResponse(
					'Gagal menyimpan data Mahasiswa IPK Tertinggi ke database.',
					'Kesalahan Sistem'
				),
				values
			});
		}
	},
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		if (!publicId) {
			return fail(400, { ...errorResponse('Public Id tidak di temukan', 'Error') });
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
