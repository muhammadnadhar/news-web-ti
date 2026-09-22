import { getAllNews } from '$lib/repository/admin/article/berita';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Mengambil semua daftar berita dari database
	// const newsList = await getAllNews();

	return {
		news: getAllNews()
	};
};
