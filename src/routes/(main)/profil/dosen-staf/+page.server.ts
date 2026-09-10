import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllLecturerStaff } from '$lib/server/admin/repository/article/profile/dosen&staff';

export const load: PageServerLoad = async () => {
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
