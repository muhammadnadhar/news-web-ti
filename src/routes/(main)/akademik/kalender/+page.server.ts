import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getActiveAcademicCalendarWithImage,
	getActiveAcademicCalendarWithImages
} from '$lib/repository/admin/article/akedemik/kalender';

export const load: PageServerLoad = async () => {
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
