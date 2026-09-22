import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from 'node:crypto';
import { successResponse, warningResponse } from '$lib/helper/message';
import { createNewsCategory } from '$lib/repository/admin/dataset/beritaKategory';

export const actions: Actions = {
	// default: async ({ request }) => {
  save: async ({ request }) => {
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

		const categoryId = randomUUID();

		try {
			const isCreated = await createNewsCategory(categoryId, {
				name,
				slug
			});

			if (!isCreated) {
				return fail(500, {
					...warningResponse('Gagal menyimpan kategori berita.', 'warning'),
					values: { name, slug }
				});
			}
		} catch (err) {
			console.error('Error creating news category:', err);
			return fail(500, {
				...warningResponse('Terjadi kesalahan server saat menyimpan kategori.', 'warning'),
				values: { name, slug }
			});
		}

		// Jika ingin otomatis kembali ke halaman daftar kategori setelah sukses:
		// throw redirect(303, '/admin/kategori-berita');

		return {
			...successResponse('Berhasil menambahkan kategori berita', 'Success')
		};
	}
};
