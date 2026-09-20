import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import crypto from 'crypto';
import { errorResponse, successResponse } from '$lib/helper/message';
import { createLecturerPublication } from '$lib/repository/admin/article/penelitian/publikasiDosen';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const lecturer_name = (formData.get('lecturer_name') as string)?.trim();
		const sinta_link = (formData.get('sinta_link') as string)?.trim() || null;
		const scholar_link = (formData.get('scholar_link') as string)?.trim() || null;

		// Validasi field wajib
		if (!lecturer_name) {
			return fail(400, {
				...errorResponse('Nama dosen wajib diisi.', 'Validasi Gagal'),
				values: { lecturer_name, sinta_link, scholar_link }
			});
		}

		try {
			const id = crypto.randomUUID(); // Buat UUID v4

			createLecturerPublication(id, lecturer_name, sinta_link, scholar_link);
			return successResponse('Data publikasi dosen berhasil ditambahkan.');
		} catch (err: any) {
			console.error('Error adding lecturer publication:', err);
			return fail(500, {
				...errorResponse('Gagal menyimpan data publikasi dosen.'),
				values: { lecturer_name, sinta_link, scholar_link }
			});
		}
	}
};
