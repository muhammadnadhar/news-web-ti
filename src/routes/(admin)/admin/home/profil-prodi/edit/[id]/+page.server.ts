import { getProfilProdiById, updateProfilProdi } from '$lib/repository/admin/home/profilProdi';
import { fail, error } from '@sveltejs/kit';
import { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID tidak valid');
	}

	const item = await getProfilProdiById(id);

	if (!item) {
		throw error(404, 'Data profil prodi tidak ditemukan');
	}

	return { item };
};
export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();

		// Mengambil ID baik dari URL params atau hidden input form
		const id = params.id || formData.get('id')?.toString();
		const title = formData.get('title')?.toString().trim();
		const description = formData.get('description')?.toString().trim() || '';
		const display_instruction =
			formData.get('display_instruction')?.toString().trim() || 'FLEX_CENTER';
		const imagesRaw = formData.get('images')?.toString() || '[]';

		let images: ImageItem[] = [];
		try {
			images = JSON.parse(imagesRaw);
		} catch (e) {
			images = [];
		}

		if (!id) {
			return fail(400, {
				status: 'error',
				title: 'Gagal Update',
				message: 'ID profil prodi tidak ditemukan.',
				values: { title, description, display_instruction, images: imagesRaw }
			});
		}

		if (!title) {
			return fail(400, {
				status: 'error',
				title: 'Gagal Update',
				message: 'Judul profil prodi wajib diisi.',
				values: { id, title, description, display_instruction, images: imagesRaw }
			});
		}

		try {
			await updateProfilProdi(id, {
				title,
				description,
				display_instruction,
				images
			});

			return {
				status: 'success',
				title: 'Berhasil',
				message: 'Profil prodi berhasil diperbarui.'
			};
		} catch (err) {
			console.error('Error updateProfilProdi:', err);
			return fail(500, {
				status: 'error',
				title: 'Gagal',
				message: 'Terjadi kesalahan server saat memperbarui profil prodi.',
				values: { id, title, description, display_instruction, images: imagesRaw }
			});
		}
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
