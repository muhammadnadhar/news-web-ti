import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getAccreditation,
	getAllAccreditations
} from '$lib/repository/admin/article/profile/akreditasi';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	try {
		//  karena ini cuman 1 data aja di table
		const accreditation = await getAccreditation();

		return {
			accreditation
		};
	} catch (err) {
		console.error('Error loading Accreditations:', err);
		throw error(500, 'Gagal mengambil data akreditasi');
	}
};
