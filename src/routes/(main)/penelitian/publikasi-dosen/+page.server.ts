import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllLecturerPublications } from '$lib/repository/admin/article/penelitian/publikasiDosen';

export const load: PageServerLoad = async () => {
	try {
		const publications = await getAllLecturerPublications();

		return {
			publications
		};
	} catch (err) {
		console.error('Error loading Lecturer Publications:', err);
		throw error(500, 'Gagal mengambil data Publikasi Dosen');
	}
};
