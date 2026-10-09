import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getActiveAcademicCalendarWithImages } from '$lib/repository/admin/article/akedemik/kalender';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});
	try {
		// const activeCalendar = await getActiveAcademicCalendar();

		return {
			calendars: getActiveAcademicCalendarWithImages()
		};
	} catch (err) {
		console.error('Error loading Active Academic Calendar:', err);
		throw error(500, 'Gagal mengambil data Kalender Akademik');
	}
};
