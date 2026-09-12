import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllCourseMap } from '$lib/server/admin/repository/article/kurikulum/petaMatakuliah';

export const load: PageServerLoad = async () => {
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
