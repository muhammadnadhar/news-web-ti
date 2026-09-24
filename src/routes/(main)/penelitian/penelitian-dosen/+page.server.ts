 import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllLecturerResearch, getLecturerResearch } from '$lib/repository/admin/article/penelitian/penelitianDosen';

export const load: PageServerLoad = async () => {
	try {
		const researchData = await getLecturerResearch();

		return {
			researchData
		};
	} catch (err) {
		console.error('Error loading Lecturer Research:', err);
		throw error(500, 'Gagal mengambil data Penelitian Dosen');
	}
};
