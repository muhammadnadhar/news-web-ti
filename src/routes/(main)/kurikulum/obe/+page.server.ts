import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getObeCurriculum } from '$lib/repository/admin/article/kurikulum/obe';

export const load: PageServerLoad = async () => {
	try {
		const obeData = await getObeCurriculum();

		return {
			obeData
		};
	} catch (err) {
		console.error('Error loading OBE Curriculum:', err);
		throw error(500, 'Gagal mengambil data Kurikulum OBE');
	}
};
