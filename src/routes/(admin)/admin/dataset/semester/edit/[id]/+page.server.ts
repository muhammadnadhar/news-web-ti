import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getSemesterById, updateSemester } from '$lib/repository/admin/dataset/semester';
import type { SemesterFormValues } from '$lib/types/values/admin/dataset';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';

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
		const formData = await request.formData();

		const isActiveCheckbox = formData.get('is_active');

		const values: SemesterFormValues = {
			id: params.id || (formData.get('id') as string)?.trim(),
			name: formData.get('name')?.toString().trim() || '',
			academicYear: formData.get('academic_year')?.toString().trim() || '',
			isActive: isActiveCheckbox === 'on' || isActiveCheckbox === 'true' || isActiveCheckbox === 'y'
		};

		if (!values.id) {
			return fail(400, {
				...errorResponse('ID Semester tidak ditemukan.', 'Validasi Gagal'),
				values
			});
		}

		if (!values.name || !values.academicYear) {
			return fail(400, {
				...warningResponse('Harap isi semua bidang form yang wajib (*).', 'Gagal Memperbarui'),
				values
			});
		}

		try {
			await updateSemester(values.id, values.name, values.academicYear, values.isActive);

			return successResponse('Data Semester berhasil diperbarui!', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating semester:', err);

			// Pengecekan entri ganda / duplicate entry database jika ada batasan unique
			if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
				return fail(400, {
					...warningResponse(
						'Data Semester dengan kombinasi tersebut sudah ada.',
						'Gagal Memperbarui'
					),
					values
				});
			}

			return fail(500, {
				...errorResponse(
					err?.message || 'Gagal memperbarui data Semester ke database.',
					'Kesalahan Sistem'
				),
				values
			});
		}
	}
};
