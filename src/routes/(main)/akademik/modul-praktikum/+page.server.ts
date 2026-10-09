import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllPracticumModule } from '$lib/repository/admin/article/akedemik/modulePratikum';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});
	try {
		const modules = await getAllPracticumModule();

		return {
			modules
		};
	} catch (err) {
		console.error('Error loading Practicum Modules:', err);
		throw error(500, 'Gagal mengambil data Modul Praktikum');
	}
};
