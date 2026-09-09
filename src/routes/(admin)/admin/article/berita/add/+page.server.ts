import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createNews } from '$lib/server/repository/newsRepository'; // Sesuaikan path repositori Anda
import { crypto } from '$lib/server/utils'; // Atau modul UUID generator Anda

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title')?.toString().trim();
		const category = formData.get('category')?.toString().trim();
		const content = formData.get('content')?.toString().trim();
		const photo = formData.get('photo') as File | null;

		// Validasi input
		if (!title || !category || !content) {
			return fail(400, {
				error: 'Harap isi semua kolom yang wajib (*).',
				values: { title, category, content }
			});
		}

		// Contoh penanganan Upload Foto jika ada file
		let photoUrl = '';
		if (photo && photo.size > 0) {
			// Logika simpan file (misal: simpan ke static/uploads)
			// photoUrl = await saveFile(photo);
		}

		const newsId = crypto.randomUUID();

		try {
			await createNews(newsId, {
				title,
				category,
				published_at: new Date()
				// Tambahkan field photoUrl/content jika schema repository Anda disesuaikan
			});
		} catch (err) {
			console.error('Error creating news:', err);
			return fail(500, {
				error: 'Gagal menyimpan data berita ke database.',
				values: { title, category, content }
			});
		}

		throw redirect(303, '/admin/berita');
	}
};
