import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createPedomanKkp } from '$lib/repository/admin/article/akedemik/pedomanKKP';
import { randomUUID } from '$lib/crypto';
import { successResponse } from '$lib/helper/message';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const imageUrl = (formData.get('image_url') as string) || null;
		const description = (formData.get('description') as string) || null;

		// Validasi input wajib
		if (!title || title.trim() === '') {
			return fail(400, {
				success: false,
				message: 'Judul Pedoman KKP wajib diisi.',
				values: { title, imageUrl, description }
			});
		}

		// Generate UUID unik untuk Primary Key
		const id = randomUUID();

		try {
			const success = await createPedomanKkp(id, title, imageUrl, description);

			if (!success) {
				return fail(500, {
					success: false,
					message: 'Gagal menyimpan data Pedoman KKP ke database.',
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

		// Redirect ke halaman daftar Pedoman KKP
		// throw redirect(303, '/admin/akademik/pedoman-kkp');
		return successResponse(' menambah Pedoman KKP ', 'Berhasil');
	}
};
