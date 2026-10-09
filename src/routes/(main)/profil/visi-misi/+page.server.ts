import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getVisiMisi } from '$lib/repository/admin/article/profile/visiMisi';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	try {
		return {
			visiMisiData: getVisiMisi()
		};
	} catch (err) {
		console.error('Error loading Visi Misi:', err);
		throw error(500, 'Gagal mengambil data Visi & Misi');
	}
};
