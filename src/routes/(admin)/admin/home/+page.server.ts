import type { PageServerLoad } from './$types';
import { getAllPerminatanTI } from '$lib/server/admin/repository/home/tablePermitan';
import { getAllProfilProdi } from '$lib/server/admin/repository/home/profilProdi';
import { getPrimaryDosenList } from '$lib/server/admin/repository/home/dosenPrimary';

export const load: PageServerLoad = async () => {
	const [primaryDosenList, listPerminatan, listProfil] = await Promise.all([
		getPrimaryDosenList(),
		getAllPerminatanTI(),
		getAllProfilProdi()
	]);

	return {
		primaryDosenList,
		listPerminatan,
		listProfil
	};
};
