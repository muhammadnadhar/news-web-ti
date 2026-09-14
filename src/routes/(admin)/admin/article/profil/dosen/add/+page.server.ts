import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from '$lib/server/crypto';

import { createLecturerStaff } from '$lib/server/admin/repository/article/profile/dosen&staff';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const nidn = formData.get('nidn')?.toString().trim() || null;
		const expertise = formData.get('expertise')?.toString().trim();
		const pddiktiUrl = formData.get('pddikti_url')?.toString().trim() || null;
		const photoUrl = formData.get('photo_url')?.toString().trim() || null;

		// Validasi input wajib
		if (!name || !expertise) {
			return fail(400, {
				error: 'Harap isi Nama Lengkap dan Bidang Keahlian / Tugas.',
				values: { name, nidn, expertise, pddiktiUrl, photoUrl }
			});
		}

		const id = randomUUID();

		try {
			await createLecturerStaff(id, {
				name,
				nidn,
				expertise,
				pddikti_url: pddiktiUrl,
				photo_url: photoUrl
			});
		} catch (err) {
			console.error('Error creating lecturer/staff:', err);
			return fail(500, {
				error: 'Gagal menyimpan data Dosen/Staff ke database.',
				values: { name, nidn, expertise, pddiktiUrl, photoUrl }
			});
		}

		throw redirect(303, '/admin/dosen-staff');
	}
};
