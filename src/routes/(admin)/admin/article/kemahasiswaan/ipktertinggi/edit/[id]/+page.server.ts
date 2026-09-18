import { fail, error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getAllAngkatan } from '$lib/server/admin/repository/dataset/angkatan';
import { getAllSemesters } from '$lib/server/admin/repository/dataset/semester';
import {
	getHighGpaStudentById,
	updateHighGpaStudent
} from '$lib/server/admin/repository/article/kemahasiswaan/ipkTertinggi';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		// 1. Fetch data referensi dropdown & data mahasiswa berdasarkan ID
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
	default: async ({ request, params }) => {
		const formData = await request.formData();

		const id = params.id || (formData.get('id') as string);
		const studentName = formData.get('student_name')?.toString().trim();
		const gpa = parseFloat(formData.get('gpa')?.toString() || '0');
		const angkatanId = formData.get('angkatan_id')?.toString();
		const semesterId = formData.get('semester_id')?.toString();
		const imgUrl = formData.get('img_url')?.toString().trim() || null;

		const values = { id, studentName, gpa, angkatanId, semesterId, imgUrl };

		// Validation Simple
		if (!studentName || !gpa || !angkatanId || !semesterId) {
			return fail(400, {
				title: 'Validasi Gagal',
				message: 'Mohon isi semua field yang wajib (*).',
				values
			});
		}

		if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
			return fail(400, {
				title: 'Nilai IPK Tidak Valid',
				message: 'IPK harus bernilai antara 0.00 hingga 4.00.',
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
			await updateHighGpaStudent(id, studentName, gpa, angkatanId, semesterId);

			return {
				success: true,
				title: 'Berhasil Diperbarui',
				message: `Data mahasiswa ${studentName} berhasil diperbarui.`
			};
		} catch (err) {
			console.error('Error updating data:', err);
			return fail(500, {
				title: 'Gagal Memproses',
				message: 'Terjadi kesalahan pada server saat memperbarui data.',
				values
			});
		}
	}
};
