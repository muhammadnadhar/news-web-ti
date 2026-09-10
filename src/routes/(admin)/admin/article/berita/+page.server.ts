import { getAllNews } from '$lib/server/admin/repository/article/berita';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Mengambil semua daftar berita dari database
	const newsList = await getAllNews();

	return {
		news: newsList
	};
};
