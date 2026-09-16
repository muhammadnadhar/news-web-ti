import type { PageServerLoad } from './$types';
import { getAllPerminatanTI } from '$lib/server/admin/repository/home/tablePermitan';
import { getAllProfilProdi } from '$lib/server/admin/repository/home/profilProdi';
import { getPrimaryDosenList } from '$lib/server/admin/repository/home/dosenPrimary';
import { getAllProfileDashboards } from '$lib/server/admin/repository/home/profileDashboard';

export const load: PageServerLoad = async () => {
	// const [primaryDosenList, listPerminatan, listProfil, listProfileDashboard] = await Promise.all([
	// 	getPrimaryDosenList(),
	// 	getAllPerminatanTI(),
	// 	getAllProfilProdi(),
	// 	getAllProfileDashboards()
	// ]);
	//
	return {
		// primaryDosenList,
		// listPerminatan,
		// listProfil,
		// listProfileDashboard

		// Mengembalikan Promise langsung tanpa await untuk di-stream ke client
		primaryDosenList: getPrimaryDosenList(),
		listPerminatan: getAllPerminatanTI(),
		listProfil: getAllProfilProdi(),
		listProfileDashboard: getAllProfileDashboards()
	};
};
