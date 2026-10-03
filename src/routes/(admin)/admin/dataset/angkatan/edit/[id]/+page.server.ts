import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { getAngkatanById, updateAngkatan } from '$lib/repository/admin/dataset/angkatan';
import type { AngkatanFormValues } from '$lib/types/values/admin/dataset';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID Angkatan tidak valid.');
	}

	const angkatan = await getAngkatanById(id);

	if (!angkatan) {
		throw error(404, 'Data angkatan tidak ditemukan.');
	}

	return {
		angkatan: {
			id: angkatan.id,
			year: angkatan.year // Menyesuaikan nama field database ke DTO
		}
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();

		const yearRaw = (formData.get('year') as string)?.trim() || '';
		const values: AngkatanFormValues = {
			id: params.id || (formData.get('id') as string)?.trim(),
			year: yearRaw
		};

		const year = parseInt(values.year, 10);
		const currentYear = new Date().getFullYear();

		// Validasi ID
		if (!values.id) {
			return fail(400, {
				...errorResponse('ID Angkatan tidak ditemukan atau tidak valid.', 'Validasi Gagal'),
				values
			});
		}

		// Validasi Input Wajib, Angka Valid, dan Batas Logis Tahun
		if (!values.year || isNaN(year) || year < 1990 || year > currentYear + 10) {
			return fail(400, {
				...warningResponse(
					`Tahun angkatan harus berupa angka 4 digit valid antara 1990 dan ${currentYear + 10}.`,
					'Validasi Gagal'
				),
				values
			});
		}

		try {
			await updateAngkatan(values.id, year);

			return successResponse('Data angkatan berhasil diperbarui.', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating angkatan:', err);

			// Pengecekan entri ganda / duplicate entry database jika tahun diubah ke yang sudah ada
			if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
				return fail(400, {
					...warningResponse(`Tahun Angkatan ${year} sudah terdaftar.`, 'Gagal Update'),
					values
				});
			}

			return fail(500, {
				...errorResponse(
					err?.message
						? `Terjadi kesalahan sistem: ${err.message}`
						: 'Gagal memperbarui data angkatan.',
					'Kesalahan Server'
				),
				values
			});
		}
	}
};
