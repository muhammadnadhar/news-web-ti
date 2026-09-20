import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import {
	addCalendarImages,
	deleteAcademicCalendarById,
	getActiveAcademicCalendarWithImages,
	saveAcademicCalendar,
	syncRetainedCalendarImages
} from '$lib/repository/admin/article/akedemik/kalender';
import { errorResponse, successResponse } from '$lib/helper/message';

export const load: PageServerLoad = async () => {
	try {
		// contoh hais l yang di dapat
		//       {
		//   "id": "uuid-kalender-123",
		//   "title": "Kalender Akademik T.A 2025/2026",
		//   "description": "<p>Deskripsi kalender...</p>",
		//   "is_active": true,
		//   "created_at": "2026-03-09T00:00:00.000Z",
		//   "updated_at": "2026-03-09T00:00:00.000Z",
		//   "images": [
		//     {
		//       "id": "uuid-img-1",
		//       "calendar_id": "uuid-kalender-123",
		//       "image_url": "/uploads/kalender-hal-1.png"
		//     },
		//     {
		//       "id": "uuid-img-2",
		//       "calendar_id": "uuid-kalender-123",
		//       "image_url": "/uploads/kalender-hal-2.png"
		//     }
		//   ]
		// }
		return {
			calendars: getActiveAcademicCalendarWithImages()
		};
	} catch (err) {
		console.error('Error loading academic calendar:', err);
		throw error(500, 'Gagal memuat data Kalender Akademik.');
	}
};

export const actions: Actions = {
	update: async ({ request }) => {
		const formData = await request.formData();

		let id = (formData.get('id') as string)?.trim();
		const title = (formData.get('title') as string)?.trim();
		const description = (formData.get('description') as string)?.trim();
		const is_active = formData.get('is_active') === 'true';

		// Ambil list ID gambar lama yang tetap dipertahankan
		const retainedImageIds = formData.getAll('retainedImageIds') as string[];

		// Ambil string URL gambar baru dari input name "image_url"
		const rawUrls = formData.getAll('image_url') as string[];
		const newImageUrls = rawUrls.map((url) => url.trim()).filter((url) => url.length > 0);

		// Validasi input
		if (!title) {
			return fail(400, errorResponse('Judul Kalender wajib diisi.', 'Validasi Gagal'));
		}

		try {
			// Generasi UUID jika form baru
			if (!id) {
				id = crypto.randomUUID();
			}

			//Simpan / Update data utama kalender
			const calendarId = await saveAcademicCalendar(id, title, description, is_active);

			// Hapus gambar lama dari DB yang telah dibuang oleh pengguna
			await syncRetainedCalendarImages(calendarId, retainedImageIds);

			// Buat array record untuk URL gambar baru
			const newImageRecords = newImageUrls.map((url) => ({
				id: crypto.randomUUID(),
				calendarId: calendarId,
				imageUrl: url
			}));

			// Batch insert data gambar baru ke database
			if (newImageRecords.length > 0) {
				await addCalendarImages(newImageRecords);
			}

			return successResponse('Data Kalender Akademik berhasil diperbarui!');
		} catch (err: any) {
			console.error('Error updating Academic Calendar:', err);
			return fail(500, errorResponse(`Terjadi kesalahan sistem: ${err.message}`));
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, errorResponse('ID Kalender tidak ditemukan.'));
		}

		try {
			await deleteAcademicCalendarById(id);
			return successResponse('Kalender Akademik berhasil dihapus!');
		} catch (err: any) {
			console.error('Error deleting Academic Calendar:', err);
			return fail(500, errorResponse(`Gagal menghapus data: ${err.message}`));
		}
	}
};
