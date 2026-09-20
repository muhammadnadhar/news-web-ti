import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllStudentPublications } from '$lib/repository/admin/article/penelitian/publikasiMahasiswa';

export const load: PageServerLoad = async () => {
	try {
		const publications = await getAllStudentPublications();

		return {
			publications
		};
	} catch (err) {
		console.error('Error loading Student Publications:', err);
		throw error(500, 'Gagal mengambil data Publikasi Mahasiswa');
	}
};
