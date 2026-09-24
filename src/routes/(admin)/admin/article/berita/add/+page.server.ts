import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from '$lib/crypto';
import { createNews } from '$lib/repository/admin/article/berita';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { getAllNewsCategories } from '$lib/repository/admin/dataset/beritaKategory';
import type { PageServerLoad } from '../$types';
import { cloudinary } from '$lib/cloudinary/server';

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

		const title = formData.get('title')?.toString().trim() || '';
		const category = formData.get('category')?.toString().trim() || '';
		const content = formData.get('content')?.toString().trim() || '';
		const imageUrl = formData.get('imageUrl')?.toString().trim() || null;

		console.info('data  : ', title, category, content, imageUrl);

		if (!title || !category || !content) {
			return fail(400, {
				...warningResponse('Harap isi semua kolom yang wajib (*).', 'warning'),
				values: { title, category, content, imageUrl }
			});
		}
		console.info('data masuk : ', title);

		const newsId = randomUUID();

		try {
			// Memanggil method createNews sesuai struktur CreateNewsData
			const isCreated = await createNews(newsId, {
				title,
				category_id: category, // Disesuaikan dengan parameter SQL: category_id
				content,
				image_url: imageUrl,
				published_at: new Date()
			});

			if (!isCreated) {
				return fail(500, {
					...warningResponse('Gagal menyimpan berita.', 'warning'),
					values: { title, category, content, imageUrl }
				});
			}
		} catch (err) {
			console.error('Error creating news:', err);
			return fail(500, {
				...warningResponse('Terjadi kesalahan server saat menyimpan berita.', 'warning'),
				values: { title, category, content, imageUrl }
			});
		}

		// Jika ingin redirect ke halaman daftar berita setelah berhasil:
		// throw redirect(303, '/admin/berita');

		// Jika ingin tetap di halaman dan menampilkan notifikasi sukses:
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
			await cloudinary.uploader.destroy(publicId);
			return successResponse('Berhasil di batalkan', 'Succcess');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto ', 'Gagal'));
		}
	}
};
