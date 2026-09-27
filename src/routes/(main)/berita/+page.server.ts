import { getNewsBySlice, getTotalNewsCount } from '$lib/repository/admin/article/berita';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	// Ambil nomor halaman dari URL searchParam
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	// Tentukan limit per halaman
	const limit = Math.max(1, Number(url.searchParams.get('limit')) || 5);

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
