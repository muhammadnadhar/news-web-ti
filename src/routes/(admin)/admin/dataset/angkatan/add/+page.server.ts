import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createAngkatan, getAngkatanByYear } from '$lib/repository/admin/dataset/angkatan';
import { randomUUID } from '$lib/crypto';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import type { AngkatanFormValues } from '$lib/types/values/admin/dataset';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const yearRaw = (formData.get('year') as string)?.trim() || '';

		const values: AngkatanFormValues = {
			id: (formData.get('id') as string)?.trim() || randomUUID(),
			year: yearRaw
		};

		const year = parseInt(values.year, 10);

		if (!values.year || isNaN(year)) {
			return fail(400, {
				...warningResponse('Tahun Angkatan wajib diisi dengan angka yang valid.', 'Validasi Gagal'),
				values
			});
		}

		// Validasi Batas Logis Tahun (Contoh: 1990 - currentYear + 10)
		const currentYear = new Date().getFullYear();
		if (year < 1990 || year > currentYear + 10) {
			return fail(400, {
				...warningResponse(
					`Tahun Angkatan harus berada di kisaran antara 1990 dan ${currentYear + 10}.`,
					'Validasi Gagal'
				),
				values
			});
		}

		try {
			const existingAngkatan = await getAngkatanByYear(year);
			if (existingAngkatan) {
				return fail(400, {
					...warningResponse(`Tahun Angkatan ${year} sudah terdaftar.`, 'Gagal'),
					values
				});
			}
		} catch (error: any) {
			// Mengabaikan jika method getAngkatanByYear tidak diimplementasikan
		}

		try {
			const success = await createAngkatan(values.id!, year);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data Angkatan ke database.', 'Gagal'),
					values
				});
			}

			return successResponse(`Angkatan ${year} berhasil ditambahkan!`, 'Berhasil');
		} catch (error: any) {
			console.error('Error in createAngkatan:', error);

			// Pengecekan entri ganda / duplicate entry database
			if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('Duplicate entry')) {
				return fail(400, {
					...warningResponse(`Tahun Angkatan ${year} sudah terdaftar.`, 'Gagal'),
					values
				});
			}

			return fail(500, {
				...errorResponse(
					error?.message
						? `Terjadi kesalahan sistem: ${error.message}`
						: 'Terjadi kesalahan sistem saat menyimpan data.',
					'Kesalahan Server'
				),
				values
			});
		}
	}
};
