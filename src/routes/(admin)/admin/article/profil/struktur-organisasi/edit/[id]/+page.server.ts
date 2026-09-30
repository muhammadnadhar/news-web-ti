import { getPublicIdOrgStructureById, updateOrgStructure } from '$lib/repository/admin/article/profile/structure';
import { fail, error } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID tidak valid');
	}

	const item = await getPublicIdOrgStructureById(id);
  console.info(item)

	if (!item) {
		throw error(404, 'Data struktur organisasi tidak ditemukan');
	}

	return { item };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const { id } = params;
		if (!id) {
			return fail(400, { message: 'ID tidak ditemukan.' });
		}

		const formData = await request.formData();

		const title = formData.get('title')?.toString().trim();
		const image_url = formData.get('image_url')?.toString().trim() || null;
		const image_public_id = formData.get('image_public_id')?.toString().trim() || null;
		const description = formData.get('description')?.toString().trim() || null;

		if (!title) {
			return fail(400, {
				message: 'Judul struktur organisasi wajib diisi.',
				values: { title, image_url, image_public_id, description }
			});
		}

		try {
			const isUpdated = await updateOrgStructure(id, {
				title,
				image_url,
				image_public_id,
				description
			});

			if (isUpdated) {
				return {
					status: 'success',
					title: 'Berhasil',
					message: 'Struktur organisasi berhasil diperbarui.'
				};
			} else {
				return fail(500, {
					message: 'Gagal memperbarui data struktur organisasi.',
					values: { title, image_url, image_public_id, description }
				});
			}
		} catch (err) {
			console.error('Error updateOrgStructure:', err);
			return fail(500, {
				message: 'Terjadi kesalahan sistem saat memperbarui data.',
				values: { title, image_url, image_public_id, description }
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
