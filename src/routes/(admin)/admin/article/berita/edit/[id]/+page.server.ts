import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getNewsById, updateNews } from '$lib/repository/admin/article/berita';
import { warningResponse, successResponse } from '$lib/helper/message';
import { getAllNewsCategories } from '$lib/repository/admin/dataset/beritaKategory';
// Import method berita & helper response Anda
// import { getNewsById, updateNews } from '$lib/server/news';
// import { warningResponse, successResponse } from '$lib/utils/response';

/**
 *  Load data berita berdasarkan ID di URL
 */
export const load: PageServerLoad = async ({ params }) => {
	const newsId = params.id;

	if (!newsId) {
		throw error(400, 'ID Berita tidak valid');
	}

	const [berita, categories] = await Promise.all([getNewsById(newsId), getAllNewsCategories()]);

	if (!berita) {
		throw error(404, 'Berita tidak ditemukan');
	}

	// Format data agar sesuai dengan prop initialData pada FormBerita.svelte
	return {
		berita: {
			id: berita.id,
			title: berita.title,
			categories: categories,

			category: berita.category_id, // Disesuaikan dengan value option pada select kategori
			content: berita.content,
			imageUrl: berita.image_url
		}
	};
};

/**
 *  Action Form Submit untuk Update Data Berita
 */
export const actions: Actions = {
	update: async ({ request, params }) => {
		const newsId = params.id;
		const formData = await request.formData();

		const title = formData.get('title')?.toString().trim() || '';
		const category = formData.get('category')?.toString().trim() || '';
		const content = formData.get('content')?.toString().trim() || '';
		const imageUrl = formData.get('imageUrl')?.toString().trim() || null;

		// Validasi input wajib
		if (!title || !category || !content) {
			return fail(400, {
				...warningResponse('Harap isi semua kolom yang wajib (*).', 'warning'),
				values: { title, category, content, imageUrl }
			});
		}

		try {
			// Memanggil method updateNews secara dinamis
			const isUpdated = await updateNews(newsId, {
				title,
				category_id: category,
				content,
				image_url: imageUrl
			});

			if (!isUpdated) {
				return fail(500, {
					...warningResponse('Gagal memperbarui data berita.', 'warning'),
					values: { title, category, content, imageUrl }
				});
			}
		} catch (err) {
			console.error('Error updating news:', err);
			return fail(500, {
				...warningResponse('Terjadi kesalahan server saat memperbarui berita.', 'warning'),
				values: { title, category, content, imageUrl }
			});
		}

		// Jika ingin redirect ke halaman tabel berita setelah berhasil:
		// throw redirect(303, '/admin/berita');

		return {
			...successResponse('Berhasil memperbarui Berita', 'Success')
		};
	}
};
