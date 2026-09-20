import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllPartnerships } from '$lib/repository/admin/article/kerjasama/daftar';


export const load: PageServerLoad = async () => {
	try {
		// Memanggil method repository yang mengambil seluruh data kerjasama dari database
		const partnerships = await getAllPartnerships();

		return {
			partnerships
		};
	} catch (err) {
		console.error('Error loading public partnerships:', err);
		throw error(500, 'Gagal memuat data Daftar Kerjasama');
	}
};
