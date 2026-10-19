import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRecentNews } from '$lib/repository/admin/article/berita';
import { getAllProfileDashboards } from '$lib/repository/admin/home/profileDashboard';
import { getPrimaryDosenList } from '$lib/repository/admin/home/dosenPrimary';
import { getAllPerminatanTI } from '$lib/repository/admin/home/tablePermitan';
import { getAllProfilProdi } from '$lib/repository/admin/home/profilProdi';
import { readJsonFile } from '$lib/repository/json/data';
import { dashboardActionJson } from '$lib/constants';
import { getDosenWellcome } from '$lib/repository/admin/home/dosenWellcomeKaprodi';
import { actionDashboardLinks } from '$lib/data/dashboard';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

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

    const actionLink = await readJsonFile<actionDashboardLinks>(dashboardActionJson);


		return {
			// ( promise ) handle scereaming data dengan loading
			profileImgDashboard: getAllProfileDashboards(),
			recentNews: getRecentNews(10),
			listPrimaryDosen: getPrimaryDosenList(),
			listPerminatan: getAllPerminatanTI(),
			listProfil: getAllProfilProdi(),
      wellcomeKaprodi : getDosenWellcome(),

			// data UI
			actionLink,
		};
	} catch (err) {
		console.error('Error loading recent news:', err);
		throw error(500, 'Gagal mengambil data berita terbaru');
	}
};
