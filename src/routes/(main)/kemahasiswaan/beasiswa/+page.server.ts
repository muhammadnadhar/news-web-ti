import { getAllScholarships } from '$lib/repository/admin/article/kemahasiswaan/beasiswa';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const scholarships = await getAllScholarships();

	return {
		scholarships
	};
};
