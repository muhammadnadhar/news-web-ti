import { fail, error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getAllAngkatan } from '$lib/repository/admin/dataset/angkatan';
import { getAllSemesters } from '$lib/repository/admin/dataset/semester';
import {
	getHighGpaStudentById,
	updateHighGpaStudent
} from '$lib/repository/admin/article/kemahasiswaan/ipkTertinggi';
import { errorResponse, successResponse } from '$lib/helper/message';
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

		const id = params.id || (formData.get('id') as string);
		const studentName = formData.get('student_name')?.toString().trim();
		const gpa = parseFloat(formData.get('gpa')?.toString() || '0');
		const angkatanId = formData.get('angkatan_id')?.toString();
		const semesterId = formData.get('semester_id')?.toString();
		const imgUrl = formData.get('img_url')?.toString().trim() || null;

		const values = { id, studentName, gpa, angkatanId, semesterId, imgUrl };

		// Validasi Input Wajib
		if (!studentName || !gpa || !angkatanId || !semesterId) {
			return fail(400, {
				...errorResponse('Mohon isi semua field yang wajib (*).', 'Validasi Gagal'),
				values
			});
		}

		//  Validasi Rentang Nilai IPK
		if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
			return fail(400, {
				...errorResponse('IPK harus bernilai antara 0.00 hingga 4.00.', 'Nilai IPK Tidak Valid'),
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
			await updateHighGpaStudent(id, studentName, gpa, angkatanId, semesterId, imgUrl);

			return successResponse(
				`Data mahasiswa ${studentName} berhasil diperbarui.`,
				'Berhasil Diperbarui'
			);
		} catch (err) {
			console.error('Error updating data:', err);

			// Menggunakan helper errorResponse dan digabung dengan data values sebelumnya
			return fail(500, {
				...errorResponse('Terjadi kesalahan pada server saat memperbarui data.', 'Gagal Memproses'),
				values
			});
		}
	}
};
