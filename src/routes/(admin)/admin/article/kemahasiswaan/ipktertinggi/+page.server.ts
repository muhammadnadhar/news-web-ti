import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	createHighGpaStudent,
	deleteHighGpaStudent,
	getAllHighGpaStudents,
	updateHighGpaStudent
} from '$lib/repository/admin/article/kemahasiswaan/ipkTertinggi';
import { errorResponse } from '$lib/helper/message';

export const load: PageServerLoad = async () => {
	try {
		// const rawList = await getAllHighGpaStudents();

		// Transformasi data DB ke format TableContentType untuk komponen TableContent
		// const studentList: TableContentType[] = rawList.map((item) => ({
		// 	id: item.id,
		// 	items: [
		// 		{
		// 			colomn: 'Nama Mahasiswa',
		// 			row: item.student_name
		// 		},
		// 		{
		// 			colomn: 'IPK',
		// 			row: Number(item.gpa).toFixed(2)
		// 		},
		// 		{
		// 			colomn: 'Angkatan',
		// 			row: item.batch_year
		// 		},
		// 		{
		// 			colomn: 'Semester',
		// 			row: item.semester
		// 		}
		// 	]
		// }));

		return {
			// studentList,
			rawStudentList: getAllHighGpaStudents()
		};
	} catch (err) {
		console.error('Error loading high GPA students:', err);
		throw error(500, 'Gagal mengambil data Mahasiswa IPK Tertinggi.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const studentName = formData.get('student_name') as string;
		const gpaRaw = formData.get('gpa') as string;
		const batchYear = formData.get('batch_year') as string;
		const semester = formData.get('semester') as string;
		const image_url = formData.get('image_url') as string;

		const gpa = parseFloat(gpaRaw);

		if (!studentName || isNaN(gpa) || !batchYear || !semester) {
			return fail(400, { message: 'Semua kolom form wajib diisi dengan benar.' });
		}
		if (!image_url || image_url.trim().length < 0) {
			return fail(400, errorResponse('gambar Wajib di Isi', 'Gagal'));
		}

		if (gpa < 0 || gpa > 4.0) {
			return fail(400, { message: 'Nilai IPK harus berada di rentang 0.00 - 4.00.' });
		}

		try {
			if (isEdit) {
				await updateHighGpaStudent(id, studentName, gpa, batchYear, semester, image_url);
			} else {
				await createHighGpaStudent(id, studentName, gpa, batchYear, semester, image_url);
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving high GPA student:', err);
			return fail(500, { message: 'Gagal menyimpan data Mahasiswa IPK Tertinggi.' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { message: 'ID tidak valid.' });

		try {
			await deleteHighGpaStudent(id);
			return { success: true };
		} catch (err) {
			console.error('Error deleting high GPA student:', err);
			return fail(500, { message: 'Gagal menghapus data Mahasiswa IPK Tertinggi.' });
		}
	}
};
