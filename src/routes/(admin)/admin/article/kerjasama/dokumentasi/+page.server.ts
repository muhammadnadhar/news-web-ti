import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { errorResponse, successResponse } from '$lib/helper/message';
import {
	createActivityDocumentation,
	deleteActivityDocumentation,
	getAllActivityDocumentations,
	updateActivityDocumentation
} from '$lib/repository/admin/article/kerjasama/documentasi';

export const load: PageServerLoad = async () => {
	try {
		// const rawList = await getAllActivityDocumentations();

		// Transformasi data DB ke format TableContentType untuk komponen TableContent
		// const documentationList: TableContentType[] = rawList.map((item) => ({
		// 	id: item.id,
		// 	items: [
		// 		{
		// 			colomn: 'Nama',
		// 			row: item.title
		// 		},
		// 		{
		// 			colomn: 'Foto',
		// 			row: item.image_url ? `<img src="${item.image_url}" alt="${item.title}" class="h-14 w-20 object-cover rounded-lg border border-white/10" />` : '-'
		// 		},
		// 		{
		// 			colomn: 'Link GDrive / Deskripsi',
		// 			row: item.description ? `<a href="${item.description}" target="_blank" rel="noopener noreferrer" class="text-scitech-mint hover:underline break-all">${item.description}</a>` : '-'
		// 		}
		// 	]
		// }));

		return {
			documentationList: getAllActivityDocumentations() // biarkan di tangani oleh client
			// rawDocumentationList:
		};
	} catch (err) {
		console.error('Error loading activity documentations:', err);
		throw error(500, 'Gagal mengambil data Dokumentasi Kegiatan.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const title = formData.get('title') as string;
		const imageUrl = formData.get('image_url') as string;
		const description = formData.get('description') as string;
		const eventDate = formData.get('event_date') as string;

		if (!title || title.trim() === '') {
			return fail(400, { message: 'Judul / Nama kegiatan wajib diisi.' });
		}

		if (!imageUrl || imageUrl.trim() === '') {
			return fail(400, { message: 'URL / Path foto dokumentasi wajib diisi.' });
		}

		try {
			if (isEdit) {
				await updateActivityDocumentation(id, title, imageUrl, description, eventDate);
			} else {
				await createActivityDocumentation(id, title, imageUrl, description, eventDate);
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving activity documentation:', err);
			return fail(
				500,
				errorResponse('Gagal menyimpan data Dokumentasi Kegiatan.', 'gagal Menyimpan')
			);
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString().trim();

		if (!id) {
			return fail(400, {
				success: false,
				message: 'ID dokumentasi wajib disertakan.'
			});
		}

		try {
			const isSuccess = await deleteActivityDocumentation(id);

			if (!isSuccess) {
				return fail(400, {
					success: false,
					message: 'Gagal menghapus data atau data tidak ditemukan.'
				});
			}

			return {
				success: true,
				message: 'Dokumentasi kegiatan berhasil dihapus.'
			};
		} catch (err: any) {
			console.error('Error saat menghapus dokumentasi:', err);
			return fail(500, {
				success: false,
				message: 'Terjadi kesalahan sistem saat menghapus data.'
			});
		}
	}
};
