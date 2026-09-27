import type { StudentAchievementDTO } from '$lib/dto/admin/article/kemahasiswaan';
import { getAchievementSemesters, getStudentAchievementsBySemesterId, getStudentAchievementsBySemesterName } from '$lib/repository/admin/article/kemahasiswaan/mapres';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ url }) => {
	const semesterParam =  url.searchParams.get('semester_id');

  if (!semesterParam) {
            error(404, { message: 'Daftar Prestasi Non akademik tidak di temukan' });
  }
	const nonAcademicSemesters = await getAchievementSemesters('n'); // data untuk prestasi non akademik

	const activeSemester = semesterParam || nonAcademicSemesters[0]?.name || '';

	let achievements : StudentAchievementDTO[] = [];

	if (activeSemester) {
		const isUuid = /^[0-9a-fA-F-]{36}$/.test(activeSemester);

		if (isUuid) {
			achievements = await getStudentAchievementsBySemesterId(activeSemester, 'n');
		} else {
			achievements = await getStudentAchievementsBySemesterName(activeSemester, 'n');
		}
	}

	return {
		selectedSemester: activeSemester,
		semesters: nonAcademicSemesters,
		achievements
	};
};
