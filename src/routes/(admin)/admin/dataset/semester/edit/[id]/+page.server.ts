import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getSemesterById, updateSemester } from '$lib/repository/admin/dataset/semester';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		// Ambil data semester berdasarkan ID dari database
		const semester = await getSemesterById(id);

		if (!semester) {
			throw error(404, { message: 'Data semester tidak ditemukan.' });
		}

		return {
			semester
		};
	} catch (err: any) {
		if (err.status === 404) throw err;
		console.error('Error loading semester:', err);
		throw error(500, { message: 'Gagal memuat data semester.' });
	}
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const academicYear = formData.get('academic_year')?.toString().trim();
		const isActiveCheckbox = formData.get('is_active');
		const isActive: boolean =
			isActiveCheckbox === 'on' || isActiveCheckbox === 'true' || isActiveCheckbox === 'y';

		const values = {
			name,
			academicYear,
			isActive
		};

		if (!name || !academicYear) {
			return fail(400, {
				success: false,
				title: 'Gagal Memperbarui',
				message: 'Harap isi semua bidang form yang wajib (*).',
				values
			});
		}

		try {
			await updateSemester(id, name, academicYear, isActive);

			return {
				success: true,
				title: 'Berhasil',
				message: 'Data Semester berhasil diperbarui!'
			};
		} catch (err) {
			console.error('Error updating semester:', err);
			return fail(500, {
				success: false,
				title: 'Kesalahan Sistem',
				message: 'Gagal memperbarui data Semester ke database.',
				values
			});
		}
	}
};
