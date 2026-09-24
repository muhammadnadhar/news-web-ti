import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createAngkatan, getAngkatanByYear } from '$lib/repository/admin/dataset/angkatan';
import { randomUUID } from '$lib/crypto';
import { errorResponse, successResponse } from '$lib/helper/message';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const yearRaw = formData.get('year') as string;
		const year = parseInt(yearRaw, 10);

		// Validasi Input Wajib & Harus Angka
		if (!yearRaw || isNaN(year)) {
			return fail(400, {
				...errorResponse('Tahun Angkatan wajib diisi dengan angka yang valid.', 'Validasi Gagal'),
				values: { year: yearRaw }
			});
		}

		//  Validasi Batas Logis Tahun (Contoh: 1990 - 2036)
		const currentYear = new Date().getFullYear();
		if (year < 1990 || year > currentYear + 10) {
			return fail(400, {
				...errorResponse(
					`Tahun Angkatan harus berada di kisaran antara 1990 dan ${currentYear + 10}.`,
					'Gagal'
				),
				values: { year: yearRaw }
			});
		}

		// Validasi Cek Duplikasi Tahun (karena kolom `year` bertipe UNIQUE)
		try {
			const existingAngkatan = await getAngkatanByYear(year);
			if (existingAngkatan) {
				return fail(400, {
					success: false,

					title: 'Gagal',
					message: `Tahun Angkatan ${year} sudah ada`,
					values: { year: yearRaw }
				});
			}
		} catch (error: any) {
			// Mengabaikan jika method getAngkatanByYear tidak diimplementasikan
		}

		// Generate UUID unik untuk Primary Key
		const id = randomUUID();

		try {
			const success = await createAngkatan(id, year);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data Angkatan ke database.', 'Gagal'),
					values: { year: yearRaw }
				});
			}
		} catch (error: any) {
			// Pengecekan entri ganda/duplicate entry database
			if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('Duplicate entry')) {
				return fail(400, {
					...errorResponse(`Tahun Angkatan ${year} sudah terdaftar.`, 'Gagal'),
					values: { year: yearRaw }
				});
			}
			return fail(500, {
				...errorResponse('Terjadi kesalahan sistem: ' + error.message, 'Gagal'),
				values: { year: yearRaw }
			});
		}
		// Redirect ke halaman daftar Angkatan
		// throw redirect(303, '/admin/akademik/angkatan');
		return successResponse(`Angkatan ${year} berhasil ditambahkan!`, 'Berhasil');
	}
};
