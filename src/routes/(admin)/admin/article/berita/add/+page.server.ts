import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from '$lib/crypto';
import { createNews } from '$lib/repository/admin/article/berita';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { getAllNewsCategories } from '$lib/repository/admin/dataset/beritaKategory';
import type { PageServerLoad } from '../$types';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { NewsFormValues } from '$lib/types/values/admin/article';

export const load: PageServerLoad = async () => {
	// Ambil semua daftar kategori berita dari database
	const categories = await getAllNewsCategories();

	return {
		categories
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		// Ekstraksi data & susun langsung ke tipe NewsFormValues
		const values: NewsFormValues = {
			title: formData.get('title')?.toString().trim() || '',
			category: formData.get('category')?.toString().trim() || '',
			content: formData.get('content')?.toString().trim() || '',
			imageUrl: formData.get('imageUrl')?.toString().trim() || null,
			imageId: formData.get('image_public_id')?.toString().trim() || null
		};

		console.info('data  : ', values);

		// 2. Pengecekan kolom wajib diisi
		if (!values.title || !values.category || !values.content) {
			return fail(400, {
				...warningResponse('Harap isi semua kolom yang wajib (*).', 'warning'),
				values
			});
		}

		// 3. Pengecekan panjang title untuk VARCHAR(255)
		if (values.title.length > 255) {
			return fail(400, {
				...warningResponse('Judul terlalu panjang, maksimal 255 karakter.', 'warning'),
				values
			});
		}

		const newsId = randomUUID();

		try {
			// Memanggil method createNews
			const isCreated = await createNews(newsId, {
				title: values.title,
				category_id: values.category,
				content: values.content,
				image_url: values.imageUrl,
				image_public_id: values.imageId,
				published_at: new Date()
			});

			if (!isCreated) {
				return fail(500, {
					...warningResponse('Gagal menyimpan berita.', 'warning'),
					values
				});
			}
		} catch (err) {
			console.error('Error creating news:', err);
			return fail(500, {
				...warningResponse('Terjadi kesalahan server saat menyimpan berita.', 'warning'),
				values
			});
		}

		return {
			...successResponse('Berhasil membuat Berita', 'Success')
		};
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
