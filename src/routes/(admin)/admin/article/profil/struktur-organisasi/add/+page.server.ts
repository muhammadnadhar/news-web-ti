import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createOrgStructure } from '$lib/repository/admin/article/profile/structure';
import { randomUUID } from '$lib/crypto';
import { errorResponse, successResponse } from '$lib/helper/message';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const imageUrl = (formData.get('image_url') as string) || null;
		const description = (formData.get('description') as string) || null;

		// Validasi input wajib: Judul
		if (!title || title.trim() === '') {
			return fail(400, {
				...errorResponse('Judul Struktur Organisasi wajib diisi.', 'Validasi Gagal'),
				values: { title, imageUrl, description }
			});
		}

		// Generate UUID unik untuk Primary Key
		const id = randomUUID();

		try {
			const success = await createOrgStructure(id, { title, image_url: imageUrl, description });

			if (!success) {
				return fail(500, {
					...errorResponse(
						'Gagal menyimpan data Struktur Organisasi ke database.',
						'Gagal Menyimpan'
					),
					values: { title, imageUrl, description }
				});
			}
		} catch (error: any) {
			return fail(500, {
				...errorResponse('Terjadi kesalahan sistem: ' + error.message, 'Kesalahan Sistem'),
				values: { title, imageUrl, description }
			});
		}

		// Redirect ke halaman daftar Struktur Organisasi
		// throw redirect(303, '/admin/profil/struktur-organisasi');
		//
		return successResponse('Data Struktur Organisasi berhasil disimpan!', 'Berhasil');
	}
};
