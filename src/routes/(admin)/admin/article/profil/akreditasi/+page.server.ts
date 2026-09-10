import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { crypto } from '$lib/server/crypto'; // Atau panggil crypto.randomUUID() native Node.js
import { getAccreditation, upsertAccreditation } from '$lib/server/admin/repository/article/profile/akreditasi';

export const load: PageServerLoad = async () => {
	try {
		const accreditation = await getAccreditation();

		return {
			accreditation
		};
	} catch (err) {
		console.error('Error loading accreditation data:', err);
		throw error(500, 'Gagal mengambil data akreditasi dari server');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const description = formData.get('description') as string;
		const imageFile = formData.get('image') as File | null;

		if (!description) {
			return fail(400, { missingDescription: true, message: 'Isi deskripsi akreditasi wajib diisi.' });
		}

		let imageUrl: string | null = (formData.get('existing_image_url') as string) || null;

		// Handle Upload Gambar jika ada berkas baru yang diunggah
		if (imageFile && imageFile.size > 0) {
			// Logika upload gambar Anda (misal simpan ke folder static/uploads atau cloud storage)
			// const fileName = `${Date.now()}-${imageFile.name}`;
			// imageUrl = `/uploads/${fileName}`;
		}

		try {
			const success = await upsertAccreditation(id, {
				image_url: imageUrl,
				description
			});

			if (!success) {
				return fail(500, { message: 'Gagal memperbarui data akreditasi.' });
			}

			return { success: true };
		} catch (err) {
			console.error('Error saving accreditation:', err);
			return fail(500, { message: 'Terjadi kesalahan sistem saat menyimpan data.' });
		}
	}
};
