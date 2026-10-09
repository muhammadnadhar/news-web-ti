import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllPedomanKkp } from '$lib/repository/admin/article/akedemik/pedomanKKP';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan ( performance instan )
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});
	try {
		const pedomanKkpList = await getAllPedomanKkp();

		return {
			pedomanKkpList
		};
	} catch (err) {
		console.error('Error loading Pedoman KKP:', err);
		throw error(500, 'Gagal mengambil data Pedoman KKP');
	}
};
