import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { errorResponse } from '$lib/helper/message';
import { addPerminatanTI } from '$lib/repository/admin/home/tablePermitan';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const description = formData.get('description')?.toString().trim();

		// Validasi Input
		if (!title || title.length > 150) {
			return fail(400, {
				success: false,
				status: 'warning' as const,
				title: 'Validasi Gagal',
				message: 'Judul peminatan wajib diisi dan maksimal 150 karakter.'
			});
		}

		if (!description) {
			return fail(400, {
				success: false,
				status: 'warning' as const,
				title: 'Validasi Gagal',
				message: 'Deskripsi peminatan wajib diisi.'
			});
		}

		try {
			const data = await addPerminatanTI({
				title,
				description
			});

			if (!data) {
				return fail(403, errorResponse('gagal membuat data perminatan TI ', 'Error'));
			}

			return {
				success: true,
				status: 'success' as const,
				title: 'Berhasil Disimpan!',
				message: 'Data peminatan TI baru telah berhasil ditambahkan.'
			};
		} catch (err) {
			console.error('Error in addPeminatanTI:', err);
			return fail(500, {
				success: false,
				status: 'error' as const,
				title: 'Terjadi Kesalahan',
				message: 'Gagal menyimpan data peminatan ke database. Silakan coba beberapa saat lagi.'
			});
		}
	}
};
