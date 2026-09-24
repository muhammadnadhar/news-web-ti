import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createActivityDocumentation } from '$lib/repository/admin/article/kerjasama/documentasi';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const imageUrl = formData.get('image_url') as string;
		const description = (formData.get('description') as string) || null;
		const eventDate = (formData.get('event_date') as string) || null;
		const linkDrive = (formData.get('link_drive') as string) || null;

		// Validasi input wajib: Judul
		if (!title || title.trim() === '') {
			return fail(400, {
				...warningResponse('Judul Kegiatan / Nama Dokumentasi wajib diisi.', 'Gagal'),
				values: { title, imageUrl, description, eventDate }
			});
		}

		// Validasi input wajib: Foto Media (karena kolom DB NOT NULL)
		if (!imageUrl || imageUrl.trim() === '') {
			return fail(400, {
				...errorResponse('Foto / Media Dokumentasi wajib diunggah.', 'Gagal'),
				values: { title, imageUrl, description, eventDate, linkDrive }
			});
		}

		const id = randomUUID();

		try {
			const success = await createActivityDocumentation(
				id,
				title,
				imageUrl,
				description,
				eventDate,
				linkDrive
			);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data Dokumentasi Kegiatan ke database.', 'Gagal'),
					values: { title, imageUrl, description, eventDate }
				});
			}
		} catch (error: any) {
			return fail(500, {
				...errorResponse('Terjadi kesalahan sistem: ' + error.message, 'Gagal'),
				values: { title, imageUrl, description, eventDate }
			});
		}

		// Redirect ke halaman daftar Dokumentasi Kegiatan
		// throw redirect(303, '/admin/kegiatan/dokumentasi');

		return successResponse('Data Mitra Documentasi berhasil disimpan!', 'Berhasil');
	}
};
