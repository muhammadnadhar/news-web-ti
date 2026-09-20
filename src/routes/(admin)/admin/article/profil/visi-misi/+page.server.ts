import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getVisiMisi, upsertVisiMisi } from '$lib/repository/admin/article/profile/visiMisi';
import { errorResponse, successResponse } from '$lib/helper/message';

export const load: PageServerLoad = async () => {
	try {
		const visiMisi = await getVisiMisi();

		return {
			visiMisi
		};
	} catch (err) {
		return fail(500, errorResponse('Gagal mengambil data Visi Misi dari server'));
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const content = formData.get('content') as string;

		if (!content || content.trim() === '') {
			return fail(
				400,
				errorResponse('Isi Visi Misi tidak boleh kosong.', 'Validasi Gagal', {
					content: ['Isi Visi Misi wajib diisi.']
				})
			);
		}

		try {
			const success = await upsertVisiMisi(id, { content });

			if (!success) {
				return fail(500, errorResponse('Gagal memperbarui data Visi Misi.'));
			}

			return successResponse('Data Visi Misi berhasil disimpan!');
		} catch (err) {
			return fail(500, errorResponse('Terjadi kesalahan sistem saat menyimpan data.'));
		}
	}
};
