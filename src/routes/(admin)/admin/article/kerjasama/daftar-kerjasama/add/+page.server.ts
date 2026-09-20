import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from '$lib/crypto';
import { createPartnership } from '$lib/repository/admin/article/kerjasama/daftar';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const institutionName = formData.get('institution_name')?.toString().trim();
		const logoUrl = formData.get('logo_url')?.toString().trim() || null;

		// Validasi input wajib
		if (!institutionName) {
			return fail(400, {
				success: false,
				title: 'Gagal',
				status: 'Warning',
				message: 'Harap isi Nama Instansi / Mitra Kerjasama.',
				values: { institutionName, logoUrl }
			});
		}

		const id = randomUUID();

		try {
			await createPartnership(id, institutionName, logoUrl);
		} catch (err) {
			console.error('Error creating partnership:', err);
			return fail(500, {
				success: false,
				title: 'Gagal',
				status: 'Error',
				message: 'Gagal menyimpan data Kerjasama ke database.',
				values: { institutionName, logoUrl }
			});
		}

		// throw redirect(303, '/admin/kerjasama');
		return {
			success: true,
			title: 'Berhasil',
			status: 'success' as const,
			message: 'Data Mitra Kerjasama berhasil disimpan!'
		};
	}
};
