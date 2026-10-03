import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createOrgStructure } from '$lib/repository/admin/article/profile/structure';
import { randomUUID } from '$lib/crypto';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { OrgStructureFormValues } from '$lib/types/values/admin/article';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe OrgStructureFormValues
		const values: OrgStructureFormValues = {
			title: formData.get('title')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			image_public_id:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null,
			description: formData.get('description')?.toString().trim() || null
		};

		// Validasi input wajib: Judul
		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul Struktur Organisasi wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		const id = randomUUID();

		try {
			const success = await createOrgStructure(id, {
				title: values.title,
				image_url: values.image_url,
				image_public_id: values.image_public_id,
				description: values.description
			});

			if (!success) {
				// Cleanup Cloudinary jika simpan DB gagal
				if (values.image_public_id) {
					try {
						await deleteImageFromCloudinary(values.image_public_id);
					} catch (cleanupErr) {
						console.error('Gagal melakukan cleanup Cloudinary:', cleanupErr);
					}
				}

				return fail(500, {
					...errorResponse(
						'Gagal menyimpan data Struktur Organisasi ke database.',
						'Gagal Menyimpan'
					),
					values
				});
			}
		} catch (error: any) {
			console.error('Error creating org structure:', error);

			// Cleanup Cloudinary jika terjadi exception / kesalahan sistem
			if (values.image_public_id) {
				try {
					await deleteImageFromCloudinary(values.image_public_id);
				} catch (cleanupErr) {
					console.error('Gagal melakukan cleanup Cloudinary:', cleanupErr);
				}
			}

			return fail(500, {
				...errorResponse(
					'Terjadi kesalahan sistem: ' + (error?.message || 'Gagal menyimpan data'),
					'Kesalahan Sistem'
				),
				values
			});
		}

		return successResponse('Data Struktur Organisasi berhasil disimpan!', 'Berhasil');
	},
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		console.info('deleted', publicId);

		if (!publicId) {
			return fail(400, errorResponse('Public Id tidak di temukan', 'Error'));
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
