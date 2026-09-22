import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import  { deleteNewsCategory, getAllNewsCategories } from '$lib/repository/admin/dataset/beritaKategory';
import { successResponse, warningResponse } from '$lib/helper/message';

/**
 * Load data kategori berita
 */
export const load: PageServerLoad = async () => {
	return {
		// Mengirimkan promise agar dapat di-await secara asynchronous di template Svelte
		categories: getAllNewsCategories()
	};
};

/**
 * Action Delete Kategori
 */
export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, warningResponse('ID Kategori tidak ditemukan.', 'Warning'));
		}

		try {
			const isDeleted = await deleteNewsCategory(id);
			if (!isDeleted) {
				return fail(404, warningResponse('Kategori tidak ditemukan atau gagal dihapus.', 'Warning'));
			}

			return successResponse('Kategori berita berhasil dihapus.', 'Success');
		} catch (err) {
			console.error('Error deleting news category:', err);
			return fail(500, warningResponse('Gagal menghapus kategori berita. Pastikan tidak ada berita yang terikat pada kategori ini.', 'Error'));
		}
	}
};
