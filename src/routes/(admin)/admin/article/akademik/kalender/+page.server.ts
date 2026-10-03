import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import {
	addCalendarImages,
	deleteAcademicCalendarById,
	getActiveAcademicCalendarWithImages,
	getCalendarImagePublicIdsByCalendarId,
	saveAcademicCalendar,
	syncRetainedCalendarImages
} from '$lib/repository/admin/article/akedemik/kalender';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { CalendarFormValues } from '$lib/types/values/admin/article';
import { randomUUID } from '$lib/crypto';

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

		//  Ekstraksi data input ke objek values bertipe CalendarFormValues
		const rawUrls = formData.getAll('image_url') as string[];

		const values: CalendarFormValues = {
			id: formData.get('id')?.toString().trim() || undefined,
			title: formData.get('title')?.toString().trim() || '',
			description: formData.get('description')?.toString().trim() || null,
			isActive: formData.get('is_active') === 'true',
			retainedImageIds: formData.getAll('retainedImageIds') as string[],
			newImageUrls: rawUrls.map((url) => url.trim()).filter((url) => url.length > 0)
		};

		// Validasi input wajib
		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul Kalender wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		//  Pengecekan panjang title (VARCHAR 255)
		if (values.title.length > 255) {
			return fail(400, {
				...warningResponse(
					'Judul Kalender terlalu panjang, maksimal 255 karakter.',
					'Validasi Gagal'
				),
				values
			});
		}

		try {
			// Generasi UUID jika ID belum ada
			const calendarId = values.id || crypto.randomUUID();

			await saveAcademicCalendar(
				calendarId,
				values.title,
				values.description || '',
				values.isActive
			);

			// Hapus gambar lama dari DB yang tidak ada di retainedImageIds
			await syncRetainedCalendarImages(calendarId, values.retainedImageIds);

			// Buat array record untuk URL gambar baru
			const newImageRecords = values.newImageUrls.map((url) => ({
				id: randomUUID(),
				calendarId,
				imageUrl: url
			}));

			// Batch insert data gambar baru ke database
			if (newImageRecords.length > 0) {
				await addCalendarImages(newImageRecords);
			}

			return {
				...successResponse('Data Kalender Akademik berhasil diperbarui!', 'Berhasil')
			};
		} catch (err: any) {
			console.error('Error updating Academic Calendar:', err);
			return fail(500, {
				...warningResponse(
					`Terjadi kesalahan sistem: ${err.message || 'Gagal menyimpan kalender'}`,
					'Kesalahan Sistem'
				),
				values
			});
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, warningResponse('ID Kalender Akademik tidak ditemukan.', 'Gagal'));
		}

		try {
			//  Ambil semua image_public_id yang terikat dengan calendar_id ini
			const publicIds = await getCalendarImagePublicIdsByCalendarId(id);

			// Jika ada gambar di Cloudinary, hapus semuanya secara paralel (Promise.all)
			if (publicIds.length > 0) {
				await Promise.all(publicIds.map((publicId) => deleteImageFromCloudinary(publicId)));
			}

			//  Hapus data dari database (otomatis menghapus di tabel anak & induk)
			const isDeleted = await deleteAcademicCalendarById(id);

			if (!isDeleted) {
				return fail(
					404,
					warningResponse('Data Kalender Akademik tidak ditemukan atau sudah dihapus.', 'Gagal')
				);
			}
			return successResponse(
				`Kalender Akademik beserta ${publicIds.length} gambar terkait berhasil dihapus!`,
				'Berhasil'
			);
		} catch (err: any) {
			console.error('Error deleting Academic Calendar:', err);
			return fail(
				500,
				errorResponse(
					err?.message
						? `Gagal menghapus data: ${err.message}`
						: 'Terjadi kesalahan sistem saat menghapus Kalender Akademik.',
					'Kesalahan Sistem'
				)
			);
		}
	},
	deleteImage: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		if (!publicId) {
			return fail(400, { ...errorResponse('Public Id tidak di temukan', 'Error') });
		}
		console.info('id : ', publicId);
		try {
			await deleteImageFromCloudinary(publicId);
			return successResponse('Berhasil di batalkan', 'Succcess');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto ', 'Gagal'));
		}
	}
};
