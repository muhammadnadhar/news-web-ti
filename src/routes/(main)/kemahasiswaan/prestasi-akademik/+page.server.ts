import { getAchievementSemesters, getStudentAchievementsBySemesterId, getStudentAchievementsBySemesterName } from '$lib/repository/admin/article/kemahasiswaan/mapres';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { StudentAchievementDTO } from '$lib/dto/admin/article/kemahasiswaan';

// guankan parameter
export const load: PageServerLoad = async ({ url }) => {
	const semesterParam = url.searchParams.get('semester_id');

  if (!semesterParam) {
            error(404, { message: 'daftar Semester akademik tidak ada ' });
  }
	const academicSemesters = await getAchievementSemesters('y'); // data untuk Prestasi akademik 

	// Tentukan semester yang aktif (Gunakan param URL, jika tidak ada gunakan semester terbaru)
	const activeSemester = semesterParam || academicSemesters[0]?.name || '';

	let achievements : StudentAchievementDTO[] = [];

	if (activeSemester) {
		const isUuid = /^[0-9a-fA-F-]{36}$/.test(activeSemester);

		if (isUuid) {
			achievements = await getStudentAchievementsBySemesterId(activeSemester, 'y');
		} else {
			achievements = await getStudentAchievementsBySemesterName(activeSemester, 'y');
		}
	}

	return {
		selectedSemester: activeSemester,
		semesters: academicSemesters,
		achievements
	};
};
