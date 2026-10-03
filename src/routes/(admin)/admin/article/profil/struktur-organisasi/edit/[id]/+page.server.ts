import {
	getOrgStructureById,
	getPublicIdOrgStructureById,
	updateOrgStructure
} from '$lib/repository/admin/article/profile/structure';
import { fail, error } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
import type { OrgStructureFormValues } from '$lib/types/values/admin/article';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID tidak valid');
	}

	const item = await getOrgStructureById(id);

	if (!item) {
		throw error(404, 'Data struktur organisasi tidak ditemukan');
	}

	return { item };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe OrgStructureFormValues
		const values: OrgStructureFormValues = {
			id,
			title: formData.get('title')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			image_public_id:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null,
			description: formData.get('description')?.toString().trim() || null
		};

		// Validasi ID dari URL
		if (!id) {
			return fail(400, {
				...errorResponse('ID Struktur Organisasi tidak ditemukan di URL.', 'Validasi Gagal'),
				values
			});
		}

		// Validasi Input Wajib: Judul
		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul struktur organisasi wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const isUpdated = await updateOrgStructure(id, {
				title: values.title,
				image_url: values.image_url,
				image_public_id: values.image_public_id,
				description: values.description
			});

			if (!isUpdated) {
				return fail(500, {
					...errorResponse('Gagal memperbarui data struktur organisasi.', 'Gagal Memperbarui'),
					values
				});
			}

			return successResponse('Struktur organisasi berhasil diperbarui.', 'Berhasil');
		} catch (err: any) {
			console.error('Error updateOrgStructure:', err);

			return fail(500, {
				...errorResponse(
					'Terjadi kesalahan sistem saat memperbarui data: ' + (err?.message || 'Gagal menyimpan'),
					'Kesalahan Server'
				),
				values
			});
		}
	},
	deletePhoto: async ({ request, params }) => {
		const formData = await request.formData();
		let publicId = formData.get('public_id')?.toString();

		if (!publicId && params.id) {
			publicId = (await getPublicIdOrgStructureById(params.id)) ?? undefined;
		}

		if (!publicId) {
			return fail(400, { message: 'Public ID gambar tidak ditemukan' });
		}

		try {
			// Jika ada helper penghapusan Cloudinary server-side, panggil di sini
			await deleteImageFromCloudinary(publicId);
			return {
				status: 'success',
				title: 'Berhasil',
				message: 'Gambar berhasil dihapus.'
			};
		} catch (err) {
			console.error('Error deletePhoto action:', err);
			return fail(500, { message: 'Gagal menghapus gambar dari server.' });
		}
	}
};
