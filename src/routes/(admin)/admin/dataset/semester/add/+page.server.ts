import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createSemester } from '$lib/repository/admin/dataset/semester';

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
				success: false,
				title: 'Gagal',
				status: 'warning' as const,
				message: 'Nama Semester wajib diisi.',
				values: { name, academicYear, isActive }
			});
		}

		// Validasi input wajib: Tahun Ajaran
		if (!academicYear || academicYear.trim() === '') {
			return fail(400, {
				success: false,

				title: 'Gagal',

				status: 'warning' as const,
				message: 'Tahun Ajaran wajib diisi.',
				values: { name, academicYear, isActive }
			});
		}

		// Generate UUID unik untuk Primary Key
		const id = crypto.randomUUID();

		try {
			const success = await createSemester(id, name, academicYear, isActive);

			if (!success) {
				return fail(500, {
					title: 'Gagal',
					success: false,
					status: 'error' as const,
					message: 'Gagal menyimpan data Semester ke database.',
					values: { name, academicYear, isActive }
				});
			}
		} catch (error: any) {
			return fail(500, {
				title: 'Gagal',
				success: false,
				message: 'Terjadi kesalahan sistem: ' + error.message,
				values: { name, academicYear, isActive }
			});
		}

		// Redirect ke halaman daftar Semester
		// throw redirect(303, '/admin/akademik/semester');
		return {
			success: true,
			status: 'success' as const,
			title: 'Berhasil',
			message: 'Data  semester berhasil diperbarui!'
		};
	}
};
