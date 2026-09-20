import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllPedomanTa } from '$lib/repository/admin/article/akedemik/pedomanTa';

export const load: PageServerLoad = async () => {
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
