import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllPracticumModule } from '$lib/repository/admin/article/akedemik/modulePratikum';

export const load: PageServerLoad = async () => {
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
