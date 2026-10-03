import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getVisiMisi, upsertVisiMisi } from '$lib/repository/admin/article/profile/visiMisi';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import type { VisiMisiFormValues } from '$lib/types/values/admin/article';

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

		const values: VisiMisiFormValues = {
			id: (formData.get('id') as string)?.trim() || crypto.randomUUID(),
			content: (formData.get('content') as string)?.trim() || ''
		};

		if (!values.content) {
			return fail(400, {
				...warningResponse('Isi Visi Misi tidak boleh kosong.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const success = await upsertVisiMisi(values.id!, { content: values.content });

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal memperbarui data Visi Misi.', 'Gagal Memperbarui'),
					values
				});
			}

			return successResponse('Data Visi Misi berhasil disimpan!', 'Berhasil');
		} catch (err: any) {
			console.error('Error saving Visi Misi:', err);

			return fail(500, {
				...errorResponse('Terjadi kesalahan sistem saat menyimpan data.', 'Kesalahan Server'),
				values
			});
		}
	}
};
