import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllCourseMap } from '$lib/repository/admin/article/kurikulum/petaMatakuliah';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	try {
		const courseMaps = await getAllCourseMap();

		return {
			courseMaps
		};
	} catch (err) {
		console.error('Error loading Course Maps:', err);
		throw error(500, 'Gagal mengambil data Peta Mata Kuliah');
	}
};
