import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getNewsCategoryById, updateNewsCategory } from '$lib/repository/admin/dataset/beritaKategory';
import { successResponse, warningResponse } from '$lib/helper/message';

/**
 * 1. Load data kategori berdasarkan ID dari URL
 */
export const load: PageServerLoad = async ({ params }) => {
	const categoryId = params.id;

	if (!categoryId) {
		throw error(400, 'ID Kategori tidak valid');
	}

	const kategori = await getNewsCategoryById(categoryId);

	if (!kategori) {
		throw error(404, 'Kategori berita tidak ditemukan');
	}

	return {
		kategori: {
			id: kategori.id,
			name: kategori.name,
			slug: kategori.slug
		}
	};
};

/**
 * 2. Action Form Submit untuk Update Kategori
 */
export const actions: Actions = {
	update: async ({ request, params }) => {
		const categoryId = params.id;
		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim() || '';
		const slug = formData.get('slug')?.toString().trim() || null;

		// Validasi input wajib
		if (!name) {
			return fail(400, {
				...warningResponse('Nama kategori wajib diisi.', 'warning'),
				values: { name, slug }
			});
		}

		try {
			const isUpdated = await updateNewsCategory(categoryId, {
				name,
				slug
			});

			if (!isUpdated) {
				return fail(500, {
					...warningResponse('Gagal memperbarui kategori berita.', 'warning'),
					values: { name, slug }
				});
			}
		} catch (err) {
			console.error('Error updating news category:', err);
			return fail(500, {
				...warningResponse('Terjadi kesalahan server saat memperbarui kategori.', 'warning'),
				values: { name, slug }
			});
		}

		// Jika ingin otomatis kembali ke halaman daftar kategori setelah sukses:
		// throw redirect(303, '/admin/kategori-berita');

		return {
			...successResponse('Berhasil memperbarui kategori berita', 'Success')
		};
	}
};
