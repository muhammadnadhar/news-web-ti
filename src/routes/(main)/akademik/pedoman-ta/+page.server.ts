import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllPedomanTa } from '$lib/repository/admin/article/akedemik/pedomanTa';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	try {
		const pedomanList = await getAllPedomanTa();

		return {
			pedomanList
		};
	} catch (err) {
		console.error('Error loading Pedoman TA:', err);
		throw error(500, 'Gagal mengambil data Pedoman TA');
	}
};
