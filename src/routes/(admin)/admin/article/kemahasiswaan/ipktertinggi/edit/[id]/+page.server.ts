import { fail, error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getAllAngkatan } from '$lib/repository/admin/dataset/angkatan';
import { getAllSemesters } from '$lib/repository/admin/dataset/semester';
import {
	getHighGpaStudentById,
	updateHighGpaStudent
} from '$lib/repository/admin/article/kemahasiswaan/ipkTertinggi';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import type { IpkTertinggiFormValues } from '$lib/types/values/admin/article';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		// Fetch data referensi dropdown & data mahasiswa berdasarkan ID
		/*
		const [angkatanList, semesterList, mahasiswa] = await Promise.all([
			db.angkatan.findMany(),
			db.semester.findMany(),
			db.mahasiswaIpk.findUnique({ where: { id } })
		]);
		*/
		const [angkatanList, semesterList, mhsipk] = await Promise.all([
			getAllAngkatan(),
			getAllSemesters(),
			getHighGpaStudentById(id)
		]);

		if (!mhsipk) {
			error(404, { message: 'Data Mahasiswa tidak ditemukan' });
		}

		return {
			angkatanList,
			semesterList,
			mhsipk
		};
	} catch (err) {
		console.error('Error loading edit page:', err);
		error(500, { message: 'Gagal memuat data' });
	}
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();

		const id = params.id || formData.get('id')?.toString().trim() || undefined;

		const values: IpkTertinggiFormValues = {
			id,
			student_name: formData.get('student_name')?.toString().trim() || '',
			gpa: parseFloat(formData.get('gpa')?.toString() || '0'),
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

		if (!values.id) {
			return fail(400, {
				...warningResponse('ID mahasiswa IPK tertinggi tidak ditemukan.', 'Gagal'),
				values
			});
		}

		if (!values.student_name || isNaN(values.gpa) || !values.angkatan_id || !values.semester_id) {
			return fail(400, {
				...warningResponse('Mohon isi semua field yang wajib (*).', 'Validasi Gagal'),
				values
			});
		}

		if (isNaN(values.gpa) || values.gpa < 0 || values.gpa > 4.0) {
			return fail(400, {
				...warningResponse('IPK harus bernilai antara 0.00 hingga 4.00.', 'Nilai IPK Tidak Valid'),
				values
			});
		}

		try {
			// Update ke database
			/*
            await db.mahasiswaIpk.update({
                where: { id },
                data: {
                    studentName,
                    gpa,
                    angkatanId,
                    semesterId,
                    imgUrl
                }
            });
            */
			await updateHighGpaStudent(
				values.id,
				values.student_name,
				values.gpa,
				values.angkatan_id,
				values.semester_id,
				values.image_url,
				values.image_public_id
			);

			return {
				...successResponse(
					`Data mahasiswa ${values.student_name} berhasil diperbarui.`,
					'Berhasil Diperbarui'
				),
				values
			};
		} catch (err: any) {
			console.error('Error updating data:', err);

			return fail(500, {
				...errorResponse(
					`Terjadi kesalahan pada server saat memperbarui data: ${err?.message || 'Kesalahan tidak diketahui'}`,
					'Gagal Memproses'
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
			await deleteImageFromCloudinary(publicId);
			return successResponse('Berhasil di batalkan', 'Succcess');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto ', 'Gagal'));
		}
	}
};
