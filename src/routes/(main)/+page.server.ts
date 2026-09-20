import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRecentNews } from '$lib/repository/admin/article/berita';
import { getAllProfileDashboards } from '$lib/repository/admin/home/profileDashboard';
import { getPrimaryDosenList } from '$lib/repository/admin/home/dosenPrimary';
import { getAllPerminatanTI } from '$lib/repository/admin/home/tablePermitan';
import { getAllProfilProdi } from '$lib/repository/admin/home/profilProdi';

export const load: PageServerLoad = async () => {
	try {
		// Memanggil method untuk mengambil 10 berita terbaru
		// const recentNews = await getRecentNews(10);
		//
		// return {
		// 	recentNews
		// };
		// const [recentNews, listPrimaryDosen, listPerminatan, listProfil] = await Promise.all([
		// 	getRecentNews(10),
		// 	getPrimaryDosenList(),
		// 	getAllPerminatanTI(),
		// 	getAllProfilProdi()
		// ]);

		return {
			// ( promise ) handle scereaming data dengan loading
			profileImgDashboard: getAllProfileDashboards(),
			recentNews: getRecentNews(10),
			listPrimaryDosen: getPrimaryDosenList(),
			listPerminatan: getAllPerminatanTI(),
			listProfil: getAllProfilProdi()
		};
	} catch (err) {
		console.error('Error loading recent news:', err);
		throw error(500, 'Gagal mengambil data berita terbaru');
	}
};
