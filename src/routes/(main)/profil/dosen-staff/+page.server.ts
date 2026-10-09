import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	try {
		const lecturers = await getAllLecturerStaff();
		return {
			lecturers
		};
	} catch (err) {
		console.error('Error loading lecturer staff:', err);
		throw error(500, 'Gagal memuat data dosen & staff');
	}
};
