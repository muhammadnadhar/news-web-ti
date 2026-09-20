import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getLecturerStaffById } from '$lib/repository/admin/article/profile/dosen&staff';
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		const lecturer = await getLecturerStaffById(id);

		if (!lecturer) {
			throw error(404, 'Data Dosen/Staff tidak ditemukan');
		}

		return {
			lecturer
		};
	} catch (err: any) {
		if (err.status === 404) throw err;
		console.error(`Error loading lecturer detail (${id}):`, err);
		throw error(500, 'Terjadi kesalahan pada server');
	}
};
