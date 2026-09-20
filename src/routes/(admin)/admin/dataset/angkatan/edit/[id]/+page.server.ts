import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse } from '$lib/helper/message';
import { getAngkatanById, updateAngkatan } from '$lib/repository/admin/dataset/angkatan';

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
		const { id } = params;
		const formData = await request.formData();
		const yearInput = formData.get('year');
		const year = Number(yearInput);

		if (!id) {
			return fail(400, errorResponse('ID Angkatan tidak valid.', 'Validasi Gagal'));
		}

		if (!yearInput || isNaN(year) || year < 1990) {
			return fail(400, {
				...errorResponse('Tahun angkatan harus berupa angka 4 digit valid.', 'Validasi Gagal'),
				values: { year: yearInput }
			});
		}

		try {
			await updateAngkatan(id, year);
			return successResponse('Data angkatan berhasil diperbarui.');
		} catch (err: any) {
			console.error('Error updating angkatan:', err);
			return fail(500, {
				...errorResponse(err.message || 'Gagal memperbarui data angkatan.'),
				values: { year }
			});
		}
	}
};
