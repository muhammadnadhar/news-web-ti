import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from '$lib/server/crypto';
import { createPartnership } from '$lib/server/admin/repository/article/kerjasama/daftar';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const institutionName = formData.get('institution_name')?.toString().trim();
		const logoUrl = formData.get('logo_url')?.toString().trim() || null;

		// Validasi input wajib
		if (!institutionName) {
			return fail(400, {
				error: 'Harap isi Nama Instansi / Mitra Kerjasama.',
				values: { institutionName, logoUrl }
			});
		}

		const id = randomUUID();

		try {
			await createPartnership(id, {
				institution_name: institutionName,
				logo_url: logoUrl
			});
		} catch (err) {
			console.error('Error creating partnership:', err);
			return fail(500, {
				error: 'Gagal menyimpan data Kerjasama ke database.',
				values: { institutionName, logoUrl }
			});
		}

		throw redirect(303, '/admin/kerjasama');
	}
};
