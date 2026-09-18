import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRecentNews } from '$lib/server/admin/repository/article/berita';
import { getAllPerminatanTI } from '$lib/server/admin/repository/home/tablePermitan';
import { getAllProfilProdi } from '$lib/server/admin/repository/home/profilProdi';
import { getPrimaryDosenList } from '$lib/server/admin/repository/home/dosenPrimary';
import { getAllProfileDashboards } from '$lib/server/admin/repository/home/profileDashboard';

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
