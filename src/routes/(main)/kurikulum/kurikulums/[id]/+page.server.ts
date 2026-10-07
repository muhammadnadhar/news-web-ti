import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCurriculumsById } from '$lib/repository/admin/article/kurikulum/kurikulum';
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID Kurikulum tidak ditemukan pada URL.');
	}

	const curriculum = await getCurriculumsById(id);

	if (!curriculum) {
		throw error(404, 'Data Kurikulum tidak ditemukan.');
	}

	return {
		curriculum
	};
};
