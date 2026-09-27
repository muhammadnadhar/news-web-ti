import { error } from '@sveltejs/kit';
import { getNewsById } from '$lib/repository/admin/article/berita';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID berita tidak valid');
	}

	// Mengirim Promise langsung untuk mengaktifkan Data Streaming
	return {
		news: getNewsById(id).then((news) => {
			if (!news) {
				throw error(404, 'Berita yang Anda cari tidak ditemukan');
			}
			return news;
		})
	};
};
