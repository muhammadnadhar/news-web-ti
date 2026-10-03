import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getNewsCategoryById,
	updateNewsCategory
} from '$lib/repository/admin/dataset/beritaKategory';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import type { KategoriBeritaFormValues } from '$lib/types/values/admin/dataset';

/**
 *  Load data kategori berdasarkan ID dari URL
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
 *  Action Form Submit untuk Update Kategori
 */
export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe KategoriBeritaFormValues
		const values: KategoriBeritaFormValues = {
			id: params.id || (formData.get('id') as string)?.trim(),
			name: formData.get('name')?.toString().trim() || '',
			slug: formData.get('slug')?.toString().trim() || null
		};

		// Validasi ID
		if (!values.id) {
			return fail(400, {
				...warningResponse('ID kategori berita tidak ditemukan.', 'Validasi Gagal'),
				values
			});
		}

		// Validasi input wajib
		if (!values.name) {
			return fail(400, {
				...warningResponse('Nama kategori wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const isUpdated = await updateNewsCategory(values.id, {
				name: values.name,
				slug: values.slug
			});

			if (!isUpdated) {
				return fail(500, {
					...errorResponse('Gagal memperbarui kategori berita.', 'Gagal Update'),
					values
				});
			}

			return successResponse('Berhasil memperbarui kategori berita.', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating news category:', err);

			// Pengecekan entri ganda / duplicate entry jika name atau slug bertipe UNIQUE
			if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
				return fail(400, {
					...warningResponse(
						'Kategori berita dengan nama/slug tersebut sudah terdaftar.',
						'Gagal Update'
					),
					values
				});
			}

			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan server saat memperbarui kategori.',
					'Kesalahan Server'
				),
				values
			});
		}
	}
};
