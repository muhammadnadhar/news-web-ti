// src/routes/admin/berita/tambah/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from '$lib/crypto';
import { createNews } from '$lib/repository/admin/article/berita';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title')?.toString().trim();
		const category = formData.get('category')?.toString().trim();
		const content = formData.get('content')?.toString().trim();
		// Mengambil URL Cloudinary dari hidden input name="imageUrl"
		const imageUrl = formData.get('imageUrl')?.toString().trim() || null;

		if (!title || !category || !content) {
			return fail(400, {
				error: 'Harap isi semua kolom yang wajib (*).',
				values: { title, category, content, imageUrl }
			});
		}

		const newsId = randomUUID();

		try {
			await createNews(newsId, {
				title,
				category,
				content,
				image_url: imageUrl,
				published_at: new Date()
			});
		} catch (err) {
			console.error('Error creating news:', err);
			return fail(500, {
				error: 'Gagal menyimpan data berita ke.',
				values: { title, category, content, imageUrl }
			});
		}

		// throw redirect(303, '/admin/berita');
		return {
			error: 'Gagal m',
			values: { title, category, content, imageUrl }
		};
	}
};
