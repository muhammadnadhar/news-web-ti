import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { error, fail } from '@sveltejs/kit';
import { deleteNews, getAllNews } from '$lib/repository/admin/article/berita';
import type { PageServerLoad ,Actions } from './$types';

export const load: PageServerLoad = async () => {
	// Mengambil semua daftar berita dari database
	// const newsList = await getAllNews();

	return {
		news: getAllNews()
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString().trim();

		if (!id) {
			return fail(400, warningResponse('ID dokumentasi wajib disertakan.', 'Gagal'));
		}

		try {
			const isSuccess = await deleteNews(id);

			//  Validasi status keberhasilan hapus dari database
			if (!isSuccess) {
				return fail(400, errorResponse('Gagal menghapus data atau data tidak ditemukan.', 'Gagal'));
			}

			return successResponse('Dokumentasi kegiatan berhasil dihapus.', 'Berhasil');
		} catch (err: any) {
			console.error('Error saat menghapus dokumentasi:', err);
			return fail(
				500,
				errorResponse('Terjadi kesalahan sistem saat menghapus data.', 'Kesalahan Sistem')
			);
		}
	}
};
