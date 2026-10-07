import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { errorResponse, successResponse } from '$lib/helper/message';
import {
	deleteCurriculumById,
	getAllCurriculums
} from '$lib/repository/admin/article/kurikulum/kurikulum';

export const load: PageServerLoad = async () => {
	try {
		const curriculums = await getAllCurriculums();
		return { curriculums };
	} catch (err) {
		console.error('Error loading OBE curriculum:', err);
		return successResponse('Gagal mengambil data Kurikulum OBE.', 'Error');
	}
};

export const actions: Actions = {
	// Action untuk Hapus Kurikulum berdasarkan ID
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'ID kurikulum tidak valid.' });
		}

		try {
			// delete image data form cloudinary

			const success = await deleteCurriculumById(id);
			if (!success) {
				return fail(404, { error: 'Data kurikulum tidak ditemukan atau sudah dihapus.' });
			}
			return { success: true, message: 'Kurikulum berhasil dihapus!' };
		} catch (error) {
			console.error('Error deleting curriculum:', error);
			return fail(500, { error: 'Terjadi kesalahan saat menghapus data.' });
		}
	}
};
