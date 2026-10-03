import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getHistoryLeaderById,
	updateHistoryLeader
} from '$lib/repository/admin/article/profile/sejarah';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import type { HistoryLeaderFormValues } from '$lib/types/values/admin/article';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const historyLeader = await getHistoryLeaderById(id);

	//  Jika data tidak ditemukan, lempar error 404
	if (!historyLeader) {
		throw error(404, {
			message: 'Data sejarah pimpinan tidak ditemukan.'
		});
	}

	// 3. Ambil daftar dosen/staf untuk picker
	const lecturers = await getAllLecturerStaff();

	return {
		historyLeader, // Data lama untuk populated form
		lecturers
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		const values: HistoryLeaderFormValues = {
			id,
			period: formData.get('period')?.toString().trim() || '',
			head_id: formData.get('head_id')?.toString().trim() || null,
			secretary_id: formData.get('secretary_id')?.toString().trim() || null
		};

		// Validasi ID dari URL
		if (!id) {
			return fail(400, {
				...errorResponse('ID tidak ditemukan di URL.', 'Validasi Gagal'),
				values
			});
		}

		// Validasi Input Wajib
		if (!values.period) {
			return fail(400, {
				...warningResponse('Periode jabatan wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const success = await updateHistoryLeader(id, {
				period: values.period,
				head_id: values.head_id,
				secretary_id: values.secretary_id
			});

			if (!success) {
				return fail(500, {
					...errorResponse(
						'Gagal memperbarui data. Data mungkin sudah dihapus atau tidak ada perubahan.',
						'Gagal Memperbarui'
					),
					values
				});
			}

			return successResponse('Data sejarah pimpinan berhasil diperbarui.', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating history leader:', err);

			return fail(500, {
				...errorResponse(
					'Terjadi kesalahan sistem: ' + (err?.message || 'Gagal memperbarui data'),
					'Kesalahan Sistem'
				),
				values
			});
		}
	}
};
