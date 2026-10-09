import {
	getFacilitiesBySlice,
	getTotalFacilitiesCount
} from '$lib/repository/admin/article/profile/fasilitas';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const limit = Math.max(1, Number(url.searchParams.get('limit')) || 8);
	const search = url.searchParams.get('search') || undefined;
	const category = url.searchParams.get('category') || undefined;

	const from = (page - 1) * limit;
	const to = from + limit;

	const filters = { search, category };

	return {
		fasilitis: getFacilitiesBySlice(from, to, filters),
		pagination: getTotalFacilitiesCount(filters).then((totalFacilities) => {
			const totalPages = Math.ceil(totalFacilities / limit);
			return {
				currentPage: page,
				limit,
				totalFacilities,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1
			};
		})
	};
};
