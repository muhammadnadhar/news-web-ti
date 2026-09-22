import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	deleteHistoryLeader,
	getHistoryContent,
	upsertHistoryContent,
	getAllHistoryLeaders,
	createHistoryLeader,
	updateHistoryLeader
} from '$lib/repository/admin/article/profile/sejarah';
import { errorResponse, successResponse } from '$lib/helper/message';

export const load: PageServerLoad = async () => {
	try {
		// const [historyContent, historyLeaders] = await Promise.all([
		// 	getHistoryContent(),
		// 	getAllHistoryLeaders()
		// ]);

		return {
			historyContent: await getHistoryContent(),

			historyLeaders: getAllHistoryLeaders()
		};
	} catch (err) {
		console.error('Error loading history data:', err);
		throw error(500, 'Gagal mengambil data Sejarah dari server.');
	}
};

export const actions: Actions = {
	// Action simpan/update Konten Sejarah (Form Kiri)
	saveContent: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const title = (formData.get('title') as string) || 'Sejarah';
		const description = formData.get('description') as string;
		const imageFile = formData.get('image') as File | null;

		let imageUrl = (formData.get('existing_image_url') as string) || null;

		if (imageFile && imageFile.size > 0) {
			// Simpan file baru di sini jika ada...
		}

		try {
			await upsertHistoryContent(id, { title, image_url: imageUrl, description });
			return {
				...successResponse('Konten Sejarah berhasil diperbarui.', 'Berhasil'),
				formType: 'content'
			};
		} catch (err) {
			console.error('Error saving history content:', err);

			return fail(500, {
				...errorResponse('Gagal memperbarui Konten Sejarah.', 'Kesalahan Sistem'),
				formType: 'content'
			});
		}
	},

	// Action simpan/update Periode Pimpinan (Form Kanan)
	saveLeader: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const period = formData.get('period') as string;

		if (!period) return fail(400, { message: 'Periode tidak boleh kosong.' });

		try {
			if (isEdit) {
				await updateHistoryLeader(id, period);
			} else {
				await createHistoryLeader(id, period);
			}
			return {
				...successResponse(
					`Periode pimpinan berhasil ${isEdit ? 'diperbarui' : 'disimpan'}.`,
					'Berhasil'
				),
				formType: 'leader'
			};
		} catch (err) {
			console.error('Error saving leader period:', err);

			return fail(500, {
				...errorResponse('Gagal menyimpan periode pimpinan.', 'Kesalahan Sistem'),
				formType: 'leader'
			});
		}
	},

	// Action hapus Periode Pimpinan
	deleteLeader: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, {
				...errorResponse('ID periode tidak ditemukan.', 'Gagal Menghapus'),
				formType: 'leader'
			});
		}

		try {
			await deleteHistoryLeader(id);

			// Success Response digabung dengan formType
			return {
				...successResponse('Periode pimpinan berhasil dihapus.', 'Berhasil'),
				formType: 'leader'
			};
		} catch (err) {
			console.error('Error deleting leader period:', err);
			return fail(500, {
				...errorResponse('Gagal menghapus periode.', 'Kesalahan Sistem'),
				formType: 'leader'
			});
		}
	}
};
