import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';
import { addHistoryLeader } from '$lib/repository/admin/article/profile/sejarah';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import type { HistoryLeaderFormValues } from '$lib/types/values/admin/article';
import { randomUUID } from '$lib/crypto';

export const load: PageServerLoad = async () => {
	// Ambil daftar seluruh dosen dan staf dari database
	const lecturers = await getAllLecturerStaff();

	return {
		lecturers
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const values: HistoryLeaderFormValues = {
			id: randomUUID(),
			period: formData.get('period')?.toString().trim() || '',
			head_id: formData.get('head_id')?.toString().trim() || null,
			secretary_id: formData.get('secretary_id')?.toString().trim() || null
		};

		if (!values.period) {
			return fail(400, {
				...warningResponse('Periode jabatan wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			await addHistoryLeader(values.id ?? randomUUID(), {
				period: values.period,
				head_id: values.head_id,
				secretary_id: values.secretary_id
			});

			return successResponse('Data sejarah pimpinan berhasil disimpan!', 'Berhasil');
		} catch (error: any) {
			console.error('Error adding history leader:', error);

			return fail(500, {
				...errorResponse(
					'Gagal menyimpan data pimpinan: ' + (error?.message || 'Terjadi kesalahan sistem'),
					'Kesalahan Sistem'
				),
				values
			});
		}
	}
};
