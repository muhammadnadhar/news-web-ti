import type { PageServerLoad } from './$types';
import { getAllNews } from '$lib/server/repository/newsRepository'; // Sesuaikan path repo Anda

export const load: PageServerLoad = async () => {
	// Mengambil semua daftar berita dari database
	const newsList = await getAllNews();

	return {
		news: newsList
	};
};
