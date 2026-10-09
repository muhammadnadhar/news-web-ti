import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getAllLecturerResearch,
	getLecturerResearch
} from '$lib/repository/admin/article/penelitian/penelitianDosen';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

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
