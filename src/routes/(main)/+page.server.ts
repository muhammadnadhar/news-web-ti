import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRecentNews } from '$lib/server/admin/repository/article/berita';
import { getAllDosen } from '$lib/server/admin/repository/home/dosen';
import { getAllPerminatanTI } from '$lib/server/admin/repository/home/tablePermitan';
import { getAllProfilProdi } from '$lib/server/admin/repository/home/profilProdi';

export const load: PageServerLoad = async () => {
	try {
		// Memanggil method untuk mengambil 10 berita terbaru
		// const recentNews = await getRecentNews(10);
		//
		// return {
		// 	recentNews
		// };
    const [recentNews, listDosen, listPerminatan, listProfil] = await Promise.all([
			getRecentNews(10),
			getAllDosen(),
			getAllPerminatanTI(),
			getAllProfilProdi()
		]);

		return {
			recentNews,
			listDosen,
			listPerminatan,
			listProfil
		};
	} catch (err) {
		console.error('Error loading recent news:', err);
		throw error(500, 'Gagal mengambil data berita terbaru');
	}
};
