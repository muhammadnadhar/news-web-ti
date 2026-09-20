import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createAngkatan, getAngkatanByYear } from '$lib/repository/admin/dataset/angkatan';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const yearRaw = formData.get('year') as string;
		const year = parseInt(yearRaw, 10);

		// Validasi Input Wajib & Harus Angka
		if (!yearRaw || isNaN(year)) {
			return fail(400, {
				success: false,
				message: 'Tahun Angkatan wajib diisi dengan angka yang valid.',
				values: { year: yearRaw }
			});
		}

		// Validasi  Batas Logis Tahun (Contoh: 2000 - 2100)
		const currentYear = new Date().getFullYear();
		if (year < 1990 || year > currentYear + 10) {
			return fail(400, {
				success: false,
				title: 'Gagal',
				message: `Tahun Angkatan harus berada di kisaran antara 1990 dan ${currentYear + 10}.`,
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
					message: `Tahun Angkatan ${year} sudah ada di database.`,
					values: { year: yearRaw }
				});
			}
		} catch (error: any) {
			// Mengabaikan jika method getAngkatanByYear tidak diimplementasikan
		}

		// Generate UUID unik untuk Primary Key
		const id = crypto.randomUUID();

		try {
			const success = await createAngkatan(id, year);

			if (!success) {
				return fail(500, {
					success: false,

					title: 'Gagal',
					message: 'Gagal menyimpan data Angkatan ke database.',
					values: { year: yearRaw }
				});
			}
		} catch (error: any) {
			if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('Duplicate entry')) {
				return fail(400, {
					success: false,

					title: 'Gagal',
					message: `Tahun Angkatan ${year} sudah terdaftar.`,
					values: { year: yearRaw }
				});
			}

			return fail(500, {
				success: false,

				title: 'Gagal',
				message: 'Terjadi kesalahan sistem: ' + error.message,
				values: { year: yearRaw }
			});
		}

		// Redirect ke halaman daftar Angkatan
		// throw redirect(303, '/admin/akademik/angkatan');
		return {
			success: true,

			title: 'Berhasil',

			status: 'success' as const,
			message: `Angkatan ${year} berhasil ditambahkan!`
			// data: {
			//     id,
			//     year,
			//     createdAt: new Date()
			// }
		};
	}
};
