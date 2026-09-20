import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createRecruitment } from '$lib/repository/admin/article/akedemik/ketentuan-komprehensif';
import { errorResponse, successResponse } from '$lib/helper/message';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const imageUrl = (formData.get('image_url') as string) || null;
		const description = (formData.get('description') as string) || null;

		// Validasi input wajib
		if (!title || title.trim() === '') {
			return fail(400, {
				...errorResponse('Judul Rekrutmen wajib diisi.', 'Validasi Gagal', {
					title: ['Judul Rekrutmen wajib diisi.']
				}),
				values: { title, imageUrl, description }
			});
		}

		// Generate UUID unik untuk Primary Key
		const id = crypto.randomUUID();

		try {
			const success = await createRecruitment(id, title, imageUrl, description);

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal menyimpan data Rekrutmen Asisten ke database.'),
					values: { title, imageUrl, description }
				});
			}
		} catch (error: any) {
			return fail(500, {
				...errorResponse(`Terjadi kesalahan sistem: ${error.message}`),
				values: { title, imageUrl, description }
			});
		}

		// Redirect ke halaman daftar Rekrutmen Asisten
		// throw redirect(303, '/admin/akademik/rekrutmen-asisten');
		return successResponse('Data Rekrutmen Asisten berhasil ditambahkan!');
	}
};
