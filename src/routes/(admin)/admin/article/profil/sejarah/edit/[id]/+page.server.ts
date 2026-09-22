import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getHistoryLeaderById,
	updateHistoryLeader
} from '$lib/repository/admin/article/profile/sejarah';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';
import { errorResponse, successResponse } from '$lib/helper/message';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	// Ambil data sejarah berdasarkan ID
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
		const { id } = params; // ID dari URL
		const formData = await request.formData();

		const period = formData.get('period')?.toString().trim();
		const head_id = formData.get('head_id')?.toString().trim() || null;
		const secretary_id = formData.get('secretary_id')?.toString().trim() || null;

		if (!id) {
			return fail(400, errorResponse('ID tidak ditemukan di URL.', 'Validasi Gagal'));
		}

		// 2. Validasi Input Wajib
		if (!period) {
			return fail(400, errorResponse('Periode jabatan wajib diisi.', 'Validasi Gagal'));
		}

		try {
			const success = await updateHistoryLeader(id, {
				period,
				head_id,
				secretary_id
			});

			if (!success) {
				return fail(
					500,
					errorResponse(
						'Gagal memperbarui data. Data mungkin sudah dihapus atau tidak ada perubahan.',
						'Gagal Memperbarui'
					)
				);
			}

			return successResponse('Data sejarah pimpinan berhasil diperbarui.', 'Berhasil');
		} catch (err: any) {
			// Error Response Sistem
			return fail(
				500,
				errorResponse('Terjadi kesalahan sistem: ' + err.message, 'Kesalahan Sistem')
			);
		}

		// Redirect kembali ke halaman utama sejarah setelah berhasil
		// throw redirect(303, '/admin/profile/history');
	}
};
