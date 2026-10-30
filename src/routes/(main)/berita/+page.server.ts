import { getNewsBySlice, getTotalNewsCount } from '$lib/repository/admin/article/berita';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url, setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	// Ambil nomor halaman dari URL searchParam
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	// Tentukan limit per halaman
	const limit = Math.max(1, Number(url.searchParams.get('limit')) || 6);

	const from = (page - 1) * limit;
	const to = from + limit;

	return {
		newsList: getNewsBySlice(from, to),
		pagination: getTotalNewsCount().then((totalNews) => {
			const totalPages = Math.ceil(totalNews / limit);
			return {
				currentPage: page,
				limit,
				totalNews,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1
			};
		})
	};
};
