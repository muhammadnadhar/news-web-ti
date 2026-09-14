import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createActivityDocumentation } from '$lib/server/admin/repository/article/kerjasama/documentasi';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const imageUrl = formData.get('image_url') as string;
		const description = (formData.get('description') as string) || null;
		const eventDate = (formData.get('event_date') as string) || null;

		// Validasi input wajib: Judul
		if (!title || title.trim() === '') {
			return fail(400, {
				success: false,
				message: 'Judul Kegiatan / Nama Dokumentasi wajib diisi.',
				values: { title, imageUrl, description, eventDate }
			});
		}

		// Validasi input wajib: Foto Media (karena kolom DB NOT NULL)
		if (!imageUrl || imageUrl.trim() === '') {
			return fail(400, {
				success: false,
				message: 'Foto / Media Dokumentasi wajib diunggah.',
				values: { title, imageUrl, description, eventDate }
			});
		}

		const id = crypto.randomUUID();

		try {
			const success = await createActivityDocumentation(
				id,
				title,
				imageUrl,
				description,
				eventDate
			);

			if (!success) {
				return fail(500, {
					success: false,
					message: 'Gagal menyimpan data Dokumentasi Kegiatan ke database.',
					values: { title, imageUrl, description, eventDate }
				});
			}
		} catch (error: any) {
			return fail(500, {
				success: false,
				message: 'Terjadi kesalahan sistem: ' + error.message,
				values: { title, imageUrl, description, eventDate }
			});
		}

		// Redirect ke halaman daftar Dokumentasi Kegiatan
		throw redirect(303, '/admin/kegiatan/dokumentasi');
	}
};
