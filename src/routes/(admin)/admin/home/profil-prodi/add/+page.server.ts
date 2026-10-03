import type { ImageItem } from '$lib/dto/admin/home';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { addProfilProdi } from '$lib/repository/admin/home/profilProdi';
import type { ProfilProdiFormValues } from '$lib/types/values/admin/home';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const imagesRaw = formData.get('images')?.toString() || '[]';
		let parsedImages: ImageItem[] = [];

		try {
			parsedImages = JSON.parse(imagesRaw);
		} catch (e) {
			console.error('Error parsing images JSON:', e);
			parsedImages = [];
		}

		// Ekstraksi data ke objek values bertipe ProfilProdiFormValues
		const values: ProfilProdiFormValues = {
			id: (formData.get('id') as string)?.trim() || crypto.randomUUID(),
			title: formData.get('title')?.toString().trim() || '',
			description: formData.get('description')?.toString().trim() || '',
			displayInstruction: formData.get('display_instruction')?.toString().trim() || 'FLEX_CENTER',
			images: parsedImages
		};

		// Validasi input wajib
		if (!values.title) {
			return fail(400, {
				...warningResponse('Judul profil prodi wajib diisi.', 'Gagal Simpan'),
				values
			});
		}

		try {
			await addProfilProdi({
				id: values.id,
				title: values.title,
				description: values.description,
				display_instruction: values.displayInstruction,
				images: values.images
			});

			return successResponse('Profil prodi berhasil ditambahkan.', 'Berhasil');
		} catch (err: any) {
			console.error('Error addProfilProdi:', err);

			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan server saat menambahkan profil prodi.',
					'Gagal'
				),
				values
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
