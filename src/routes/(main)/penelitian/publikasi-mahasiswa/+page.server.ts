import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllStudentPublications } from '$lib/repository/admin/article/penelitian/publikasiMahasiswa';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

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
