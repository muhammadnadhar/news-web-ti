import type { PageServerLoad } from './$types';
import { getAllDosen } from '$lib/server/admin/repository/home/dosen';
import { getAllPerminatanTI } from '$lib/server/admin/repository/home/tablePermitan';
import { getAllProfilProdi } from '$lib/server/admin/repository/home/profilProdi';

export const load: PageServerLoad = async () => {
	const [listDosen, listPerminatan, listProfil] = await Promise.all([
		getAllDosen(),
		getAllPerminatanTI(),
		getAllProfilProdi()
	]);

	return {
		listDosen,
		listPerminatan,
		listProfil
	};
};
