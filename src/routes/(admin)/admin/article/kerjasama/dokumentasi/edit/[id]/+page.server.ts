import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getActivityDocumentationById,
	updateActivityDocumentation
} from '$lib/repository/admin/article/kerjasama/documentasi';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { DocumentationFormValues } from '$lib/types/values/admin/article';
// Sesuaikan import path repository Anda

/**
 * Mengambil data dokumentasi berdasarkan ID dari URL parameter
 */
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const documentation = await getActivityDocumentationById(id);

	if (!documentation) {
		throw error(404, {
			message: 'Dokumentasi kegiatan tidak ditemukan'
		});
	}

	return {
		documentation
	};
};

/**
 * Memproses pembaruan data dokumentasi kegiatan
 */
export const actions: Actions = {
	update: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		const values: DocumentationFormValues = {
			id,
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
				...warningResponse('Judul kegiatan wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (!values.image_url) {
			return fail(400, {
				...warningResponse('Foto / media dokumentasi wajib diunggah.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const isSuccess = await updateActivityDocumentation(
				id,
				values.title,
				values.image_url,
				values.description,
				values.event_date,
				values.link_drive,
				values.image_public_id
			);

			if (!isSuccess) {
				return fail(400, {
					...errorResponse(
						'Data tidak mengalami perubahan atau gagal diperbarui.',
						'Gagal Menyimpan'
					),
					values
				});
			}

			// 3. Kembalikan Response Berhasil (Sesuai penanganan pada komponen ActivityDocumentationForm)
			return successResponse('Dokumentasi kegiatan berhasil diperbarui.', 'Berhasil');
		} catch (err: any) {
			console.error('Error saat update dokumentasi kegiatan:', err);
			return fail(500, {
				...errorResponse(
					'Terjadi kesalahan sistem saat memperbarui data dokumentasi.',
					'Kesalahan Server'
				),
				values
			});
		}
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
