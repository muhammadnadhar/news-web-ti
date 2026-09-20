import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createOrgStructure } from '$lib/repository/admin/article/profile/structure';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const imageUrl = (formData.get('image_url') as string) || null;
		const description = (formData.get('description') as string) || null;

		// Validasi input wajib: Judul
		if (!title || title.trim() === '') {
			return fail(400, {
				success: false,
				message: 'Judul Struktur Organisasi wajib diisi.',
				values: { title, imageUrl, description }
			});
		}

		// Generate UUID unik untuk Primary Key
		const id = crypto.randomUUID();

		try {
			const success = await createOrgStructure(id, { title, image_url: imageUrl, description });

			if (!success) {
				return fail(500, {
					success: false,
					message: 'Gagal menyimpan data Struktur Organisasi ke database.',
					values: { title, imageUrl, description }
				});
			}
		} catch (error: any) {
			return fail(500, {
				success: false,
				message: 'Terjadi kesalahan sistem: ' + error.message,
				values: { title, imageUrl, description }
			});
		}

		// Redirect ke halaman daftar Struktur Organisasi
		throw redirect(303, '/admin/profil/struktur-organisasi');
	}
};
