import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllPedomanKkp } from '$lib/server/admin/repository/article/akedemik/pedomanKKP';

export const load: PageServerLoad = async () => {
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
