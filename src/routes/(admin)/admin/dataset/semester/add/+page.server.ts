import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createSemester } from '$lib/repository/admin/dataset/semester';
import { randomUUID } from '$lib/crypto';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const academicYear = formData.get('academic_year') as string;
		// Checkbox mengembalikan 'on' atau null, konversi ke boolean
		const isActive = formData.get('is_active') === 'on';

		// Validasi input wajib: Nama Semester

		if (!name || name.trim() === '') {
			return fail(400, {
				...warningResponse('Nama Semester wajib diisi.', 'Gagal'),
				values: { name, academicYear, isActive }
			});
		}

		// Validasi input wajib: Tahun Ajaran
		if (!academicYear || academicYear.trim() === '') {
			return fail(400, {
				...warningResponse('Tahun Ajaran wajib diisi.', 'Gagal'),
				values: { name, academicYear, isActive }
			});
		}

		// Generate UUID unik untuk Primary Key
		const id = randomUUID();

		try {
			const success = await createSemester(id, name, academicYear, isActive);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data Semester ke database.', 'Gagal'),
					values: { name, academicYear, isActive }
				});
			}
		} catch (error: any) {
			return fail(500, {
				...errorResponse('Terjadi kesalahan sistem: ' + error.message, 'Gagal'),
				values: { name, academicYear, isActive }
			});
		}

		// Redirect ke halaman daftar Semester
		// throw redirect(303, '/admin/akademik/semester');

		return successResponse('Data semester berhasil diperbarui!', 'Berhasil');
	}
};
