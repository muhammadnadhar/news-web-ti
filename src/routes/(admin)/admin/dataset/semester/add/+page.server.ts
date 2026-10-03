import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createSemester } from '$lib/repository/admin/dataset/semester';
import { randomUUID } from '$lib/crypto';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import type { SemesterFormValues } from '$lib/types/values/admin/dataset';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const isActiveCheckbox = formData.get('is_active');

		const values: SemesterFormValues = {
			id: (formData.get('id') as string)?.trim() || crypto.randomUUID(),
			name: formData.get('name')?.toString().trim() || '',
			academicYear: formData.get('academic_year')?.toString().trim() || '',
			isActive: isActiveCheckbox === 'on' || isActiveCheckbox === 'true' || isActiveCheckbox === 'y'
		};

		if (!values.name) {
			return fail(400, {
				...warningResponse('Nama Semester wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (!values.academicYear) {
			return fail(400, {
				...warningResponse('Tahun Ajaran wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const success = await createSemester(
				values.id!,
				values.name,
				values.academicYear,
				values.isActive
			);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data Semester ke database.', 'Gagal Simpan'),
					values
				});
			}

			return successResponse('Data Semester baru berhasil ditambahkan!', 'Berhasil');
		} catch (err: any) {
			console.error('Error creating semester:', err);

			// Pengecekan entri ganda / duplicate entry database
			if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
				return fail(400, {
					...warningResponse(
						'Data Semester dengan kombinasi tersebut sudah terdaftar.',
						'Gagal Simpan'
					),
					values
				});
			}

			return fail(500, {
				...errorResponse(
					err?.message
						? `Terjadi kesalahan sistem: ${err.message}`
						: 'Gagal menyimpan data Semester.',
					'Kesalahan Sistem'
				),
				values
			});
		}
	}
};
