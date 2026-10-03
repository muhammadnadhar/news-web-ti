import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getNewsById, updateNews } from '$lib/repository/admin/article/berita';
import { warningResponse, successResponse, errorResponse } from '$lib/helper/message';
import { getAllNewsCategories } from '$lib/repository/admin/dataset/beritaKategory';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { NewsFormValues } from '$lib/types/values/admin/article';
// Import method berita & helper response Anda
// import { getNewsById, updateNews } from '$lib/server/news';
// import { warningResponse, successResponse } from '$lib/utils/response';

/**
 *  Load data berita berdasarkan ID di URL
 */
export const load: PageServerLoad = async ({ params }) => {
	const newsId = params.id;

	if (!newsId) {
		throw error(400, 'ID Berita tidak valid');
	}

	const [berita, categories] = await Promise.all([getNewsById(newsId), getAllNewsCategories()]);

	if (!berita) {
		// throw error(404, 'Berita tidak ditemukan');
		return warningResponse('Berita tidak di temukan', 'Tidak Di temukan');
	}

	// Format data agar sesuai dengan prop initialData pada FormBerita.svelte
	return {
		berita: {
			id: berita.id,
			title: berita.title,
			categories: categories,

			category: berita.category_id, // Disesuaikan dengan value option pada select kategori
			content: berita.content,
			imageUrl: berita.image_url
		}
	};
};

/**
 *  Action Form Submit untuk Update Data Berita
 */
export const actions: Actions = {
	update: async ({ request, params }) => {
		const newsId = params.id;
		const formData = await request.formData();

		//  Ekstraksi data & susun langsung ke objek values bertipe NewsFormValues
		const values: NewsFormValues = {
			title: formData.get('title')?.toString().trim() || '',
			category: formData.get('category')?.toString().trim() || '',
			content: formData.get('content')?.toString().trim() || '',
			image_url: formData.get('imageUrl')?.toString().trim() || null,
			imageId: formData.get('image_public_id')?.toString().trim() || null
		};

		if (!values.title || !values.category || !values.content) {
			return fail(400, {
				...warningResponse('Harap isi semua kolom yang wajib (*).', 'warning'),
				values
			});
		}
		if (values.title.length > 255) {
			return fail(400, {
				...warningResponse('Judul terlalu panjang, maksimal 255 karakter.', 'warning'),
				values
			});
		}

		try {
			// Memanggil method updateNews secara dinamis
			const isUpdated = await updateNews(newsId, {
				title: values.title,
				category_id: values.category,
				content: values.content,
				image_url: values.image_url,
				image_public_id: values.imageId
			});

			if (!isUpdated) {
				return fail(500, {
					...warningResponse('Gagal memperbarui data berita.', 'warning'),
					values
				});
			}
		} catch (err) {
			console.error('Error updating news:', err);
			return fail(500, {
				...warningResponse('Terjadi kesalahan server saat memperbarui berita.', 'warning'),
				values
			});
		}

		// Jika ingin redirect ke halaman tabel berita setelah berhasil:
		// throw redirect(303, '/admin/berita');

		return {
			...successResponse('Berhasil memperbarui Berita', 'Success')
		};
	},

	// untuk edit dia akan memanggil fungsi delete Photo saat tombol batal di click
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
