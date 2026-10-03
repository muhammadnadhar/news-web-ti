import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import {
	addCalendarImages,
	createAcademicCalendar
} from '$lib/repository/admin/article/akedemik/kalender';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { CalendarFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		// Ekstraksi data input ke objek values bertipe CalendarFormValues
		const rawUrls = formData.getAll('image_url') as string[];

		const values: CalendarFormValues = {
			title: formData.get('title')?.toString().trim() || '',
			description: formData.get('description')?.toString().trim() || null,
			isActive: formData.get('is_active') === 'true',
			retainedImageIds: [], // Kosong untuk pembuat data baru
			newImageUrls: rawUrls.map((url) => url.trim()).filter((url) => url.length > 0)
		};

		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul Kalender wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

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
			const newCalendarId = randomUUID();

			// Simpan Data Utama Kalender
			await createAcademicCalendar(newCalendarId, values.title, values.description);

			// Simpan Data Gambar (jika ada)
			if (values.newImageUrls.length > 0) {
				const newImageRecords = values.newImageUrls.map((url) => ({
					id: crypto.randomUUID(),
					calendarId: newCalendarId,
					imageUrl: url
				}));
				await addCalendarImages(newImageRecords);
			}

			return successResponse('Data Kalender Akademik berhasil ditambahkan!', 'Berhasil');
		} catch (err: any) {
			console.error('Error creating Academic Calendar:', err);
			return fail(500, {
				...warningResponse(
					`Terjadi kesalahan sistem: ${err.message || 'Gagal menambahkan kalender'}`,
					'Kesalahan Sistem'
				),
				values
			});
		}
	},
	deleteImage: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		if (!publicId) {
			return fail(400, { ...errorResponse('Public Id tidak di temukan', 'Error') });
		}

		try {
			await deleteImageFromCloudinary(publicId);
			return successResponse('Berhasil di batalkan', 'Succcess');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto ', 'Gagal'));
		}
	}
};
