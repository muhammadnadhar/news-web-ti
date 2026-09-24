import type { PageServerLoad } from './$types';

// guankan parameter
export const load: PageServerLoad = async ({ params, url }) => {
	const semester = url.searchParams.get('semester');
	console.info(semester);
};
