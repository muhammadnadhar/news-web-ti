import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllOrgStructures } from '$lib/repository/admin/article/profile/structure';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

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
