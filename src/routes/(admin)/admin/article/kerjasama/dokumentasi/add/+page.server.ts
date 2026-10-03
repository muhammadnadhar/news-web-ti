import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createActivityDocumentation } from '$lib/repository/admin/article/kerjasama/documentasi';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { DocumentationFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const values: DocumentationFormValues = {
			title: formData.get('title')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || '',
			image_public_id:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null,
			event_date: formData.get('event_date')?.toString().trim() || null,
			description: formData.get('description')?.toString().trim() || null,
			link_drive: formData.get('link_drive')?.toString().trim() || null
		};

		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul Kegiatan / Nama Dokumentasi wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (!values.image_url) {
			return fail(400, {
				...warningResponse('Foto / Media Dokumentasi wajib diunggah.', 'Validasi Gagal'),
				values
			});
		}

		const id = randomUUID();

		try {
			const success = await createActivityDocumentation(
				id,
				values.title,
				values.image_url,
				values.description,
				values.event_date,
				values.link_drive,
				values.image_public_id
			);

			if (!success) {
				return fail(500, {
					...errorResponse(
						'Gagal menyimpan data Dokumentasi Kegiatan ke database.',
						'Gagal Memproses'
					),
					values
				});
			}
		} catch (error: any) {
			console.error('Error creating activity documentation:', error);
			return fail(500, {
				...errorResponse(
					'Terjadi kesalahan sistem: ' + (error?.message || 'Gagal menyimpan data'),
					'Error Server'
				),
				values
			});
		}

		return successResponse('Data Dokumentasi Kegiatan berhasil disimpan!', 'Berhasil');
	},
	deletePhoto: async ({ request }) => {
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
