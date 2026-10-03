import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from 'node:crypto';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { createNewsCategory } from '$lib/repository/admin/dataset/beritaKategory';
import type { KategoriBeritaFormValues } from '$lib/types/values/admin/dataset';

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();

		const values: KategoriBeritaFormValues = {
			id: (formData.get('id') as string)?.trim() || randomUUID(),
			name: formData.get('name')?.toString().trim() || '',
			slug: formData.get('slug')?.toString().trim() || null
		};

		// Validasi input wajib
		if (!values.name) {
			return fail(400, {
				...warningResponse('Nama kategori wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const isCreated = await createNewsCategory(values.id!, {
				name: values.name,
				slug: values.slug
			});

			if (!isCreated) {
				return fail(500, {
					...errorResponse('Gagal menyimpan kategori berita.', 'Gagal Simpan'),
					values
				});
			}

			return successResponse('Berhasil menambahkan kategori berita.', 'Berhasil');
		} catch (err: any) {
			console.error('Error creating news category:', err);

			// Pengecekan entri ganda / duplicate entry jika name atau slug bertipe UNIQUE
			if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
				return fail(400, {
					...warningResponse(
						'Kategori berita dengan nama/slug tersebut sudah terdaftar.',
						'Gagal Simpan'
					),
					values
				});
			}

			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan server saat menyimpan kategori.',
					'Kesalahan Server'
				),
				values
			});
		}
	}
};
