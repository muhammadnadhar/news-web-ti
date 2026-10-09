import { getAllScholarships } from '$lib/repository/admin/article/kemahasiswaan/beasiswa';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	const scholarships = await getAllScholarships();

	return {
		scholarships
	};
};
