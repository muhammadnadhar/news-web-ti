import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllAccreditations } from '$lib/server/admin/repository/article/profile/akreditasi';

export const load: PageServerLoad = async () => {
	try {
		const accreditations = await getAllAccreditations();

		return {
			accreditations
		};
	} catch (err) {
		console.error('Error loading Accreditations:', err);
		throw error(500, 'Gagal mengambil data akreditasi');
	}
};
