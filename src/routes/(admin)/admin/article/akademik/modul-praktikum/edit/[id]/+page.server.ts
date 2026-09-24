import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getPracticumModuleById,
	updatePracticumModule
} from '$lib/repository/admin/article/akedemik/modulePratikum';
import { warningResponse } from '$lib/helper/message';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	if (!id) {
		return {
			module: null
		};
	}

	const moduleData = await getPracticumModuleById(id);

	console.info(moduleData);

	if (!moduleData) {
		throw error(404, 'Data Modul Praktikum tidak ditemukan.');
	}

	return {
		module: moduleData
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();

		// Ambil ID dari URL params atau hidden input form
		const idFromForm = formData.get('id') as string | null;
		const targetId = params.id || idFromForm;

		// Extract input form
		const title = (formData.get('title') as string)?.trim();
		const imageUrl = (formData.get('image_url') as string)?.trim() || null;
		const description = (formData.get('description') as string)?.trim() || null;

		// Validasi field wajib
		if (!title) {
			return fail(400, {
				success: false,
				title: 'Validasi Gagal',
				message: 'Judul Modul Praktikum wajib diisi.',
				values: { title, imageUrl, description }
			});
		}

		try {
			if (targetId) {
				const isUpdated = await updatePracticumModule(targetId, title, imageUrl, description);

				if (!isUpdated) {
					return fail(500, {
						success: false,
						title: 'Gagal Memperbarui',
						message: 'Data modul praktikum tidak dapat diperbarui di database.'
					});
				}

				return {
					success: true,
					title: 'Berhasil Memperbarui',
					message: 'Modul praktikum berhasil diperbarui!'
				};
			} else {
				return warningResponse('Id data tidak ada');
			}
		} catch (err: any) {
			return fail(500, {
				success: false,
				title: 'Kesalahan Sistem',
				message: err?.message || 'Terjadi kesalahan sistem saat memproses modul praktikum.'
			});
		}
	}
};
