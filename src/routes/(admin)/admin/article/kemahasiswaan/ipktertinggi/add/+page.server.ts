import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAllAngkatan } from '$lib/repository/admin/dataset/angkatan';
import { getAllSemesters } from '$lib/repository/admin/dataset/semester';
import { createHighGpaStudent } from '$lib/repository/admin/article/kemahasiswaan/ipkTertinggi';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { cloudinary } from '$lib/cloudinary/server';
import type { IpkTertinggiFormValues } from '$lib/types/values/admin/article';

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

		const gpaRaw = formData.get('gpa')?.toString().trim();
		const gpaParsed = gpaRaw ? parseFloat(gpaRaw) : NaN;

		const values: IpkTertinggiFormValues = {
			student_name: formData.get('student_name')?.toString().trim() || '',
			gpa: gpaParsed,
			angkatan_id: formData.get('angkatan_id')?.toString().trim() || '',
			semester_id: formData.get('semester_id')?.toString().trim() || '',
			image_url:
				formData.get('image_url')?.toString().trim() ||
				formData.get('img_url')?.toString().trim() ||
				null,
			image_public_id:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null
		};

		if (!values.student_name || !gpaRaw || !values.angkatan_id || !values.semester_id) {
			return fail(400, {
				...warningResponse('Harap isi semua bidang form yang wajib (*).', 'Gagal Menyimpan'),
				values
			});
		}

		if (isNaN(values.gpa) || values.gpa < 0 || values.gpa > 4.0) {
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
			await createHighGpaStudent(
				id,
				values.student_name,
				values.gpa,
				values.angkatan_id,
				values.semester_id,
				values.image_url,
				values.image_public_id
			);

			return {
				...successResponse('Data Mahasiswa IPK Tertinggi berhasil disimpan!', 'Berhasil'),
				values
			};
		} catch (err: any) {
			console.error('Error creating high GPA student:', err);

			return fail(500, {
				...errorResponse(
					`Gagal menyimpan data Mahasiswa IPK Tertinggi ke database: ${err?.message || 'Terjadi kesalahan sistem'}`,
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
