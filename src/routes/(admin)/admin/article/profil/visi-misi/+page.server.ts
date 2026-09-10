import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getVisiMisi, upsertVisiMisi } from '$lib/server/admin/repository/article/profile/visiMisi';

export const load: PageServerLoad = async () => {
	try {
		const visiMisi = await getVisiMisi();

		return {
			visiMisi
		};
	} catch (err) {
		console.error('Error loading Visi Misi data:', err);
		throw error(500, 'Gagal mengambil data Visi Misi dari server');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const content = formData.get('content') as string;

		if (!content || content.trim() === '') {
			return fail(400, { missingContent: true, message: 'Isi Visi Misi tidak boleh kosong.' });
		}

		try {
			const success = await upsertVisiMisi(id, { content });

			if (!success) {
				return fail(500, { message: 'Gagal memperbarui data Visi Misi.' });
			}

			return { success: true };
		} catch (err) {
			console.error('Error saving Visi Misi:', err);
			return fail(500, { message: 'Terjadi kesalahan sistem saat menyimpan data.' });
		}
	}
};
