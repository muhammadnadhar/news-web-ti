import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllRecruitment } from '$lib/server/admin/repository/article/akedemik/ketentuan-komprehensif';

export const load: PageServerLoad = async () => {
	try {
		const recruitmentList = await getAllRecruitment();

		return {
			recruitmentList
		};
	} catch (err) {
		console.error('Error loading Recruitment:', err);
		throw error(500, 'Gagal mengambil data Rekrutmen / Ketentuan');
	}
};
