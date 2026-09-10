import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRecentNews } from '$lib/server/admin/repository/article/berita';

export const load: PageServerLoad = async () => {
	try {
		// Memanggil method untuk mengambil 10 berita terbaru
		const recentNews = await getRecentNews(10);

		return {
			recentNews
		};
	} catch (err) {
		console.error('Error loading recent news:', err);
		throw error(500, 'Gagal mengambil data berita terbaru');
	}
};
