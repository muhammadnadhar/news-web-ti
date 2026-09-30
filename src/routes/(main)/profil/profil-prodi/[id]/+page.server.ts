import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProfilProdiById } from '$lib/repository/admin/home/profilProdi';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID Profil Prodi tidak valid');
	}

	const profilProdi = await getProfilProdiById(id);

	if (!profilProdi) {
		throw error(404, 'Data Profil Prodi tidak ditemukan');
	}

	return {
		profilProdi
	};
};
