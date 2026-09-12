 import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllLecturerResearch } from '$lib/server/admin/repository/article/penelitian/penelitianDosen';

export const load: PageServerLoad = async () => {
	try {
		const researchList = await getAllLecturerResearch();

		return {
			researchList
		};
	} catch (err) {
		console.error('Error loading Lecturer Research:', err);
		throw error(500, 'Gagal mengambil data Penelitian Dosen');
	}
};
