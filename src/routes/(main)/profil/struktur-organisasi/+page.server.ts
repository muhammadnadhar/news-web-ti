import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllOrgStructures } from '$lib/server/admin/repository/article/profile/structure';

export const load: PageServerLoad = async () => {
	try {
		const orgStructures = await getAllOrgStructures();

		return {
			orgStructures
		};
	} catch (err) {
		console.error('Error loading Organizational Structures:', err);
		throw error(500, 'Gagal mengambil data Struktur Organisasi');
	}
};
