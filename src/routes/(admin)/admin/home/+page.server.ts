import { getPrimaryDosenList } from '$lib/repository/admin/home/dosenPrimary';
import { getAllProfileDashboards } from '$lib/repository/admin/home/profileDashboard';
import { getAllProfilProdi } from '$lib/repository/admin/home/profilProdi';
import { getAllPerminatanTI } from '$lib/repository/admin/home/tablePermitan';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async () => {
	// const [primaryDosenList, listPerminatan, listProfil, listProfileDashboard] = await Promise.all([
	// 	getPrimaryDosenList(),
	// 	getAllPerminatanTI(),
	// 	getAllProfilProdi(),
	// 	getAllProfileDashboards()
	// ]);
	console.table(await getAllProfileDashboards());
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
