import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createCourseMap } from '$lib/repository/admin/article/kurikulum/petaMatakuliah';
import { successResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const imageUrl = formData.get('image_url') as string;

		// Validasi input wajib: Judul
		if (!title || title.trim() === '') {
			return fail(400, {
				success: false,
				message: 'Judul Peta Mata Kuliah wajib diisi.',
				values: { title, imageUrl }
			});
		}

		// Validasi input wajib: Gambar (karena kolom DB NOT NULL)
		if (!imageUrl || imageUrl.trim() === '') {
			return fail(400, {
				success: false,
				message: 'Foto/Gambar Peta Mata Kuliah wajib diunggah.',
				values: { title, imageUrl }
			});
		}

		// Generate UUID unik untuk Primary Key
		const id = randomUUID();

		try {
			const success = await createCourseMap(id, title, imageUrl);

			if (!success) {
				return fail(500, {
					success: false,
					message: 'Gagal menyimpan data Peta Mata Kuliah.',
					values: { title, imageUrl }
				});
			}
		} catch (error: any) {
			return fail(500, {
				success: false,
				message: 'Terjadi kesalahan sistem: ' + error.message,
				values: { title, imageUrl }
			});
		}

		// Redirect ke halaman daftar Peta Mata Kuliah
		// throw redirect(303, '/admin/akademik/peta-matakuliah')
			return successResponse( "Berhasil menyimpan Data Mata Kuliah" ,"Success")
	}
};
