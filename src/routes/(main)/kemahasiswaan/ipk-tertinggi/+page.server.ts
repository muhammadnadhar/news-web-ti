import type { HighGpaStudentDTO } from '$lib/dto/admin/article/kemahasiswaan';
import { getHighGpaSemesters, getHighGpaStudentsBySemesterId, getHighGpaStudentsBySemesterName } from '$lib/repository/admin/article/kemahasiswaan/ipkTertinggi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Membaca query parameter 'semester' atau 'semester_id' dari URL
	const semesterParam =  url.searchParams.get('semester_id');
  if (!semesterParam){

  }

	const gpaSemesters = await getHighGpaSemesters();

	// Tentukan semester aktif (Gunakan parameter URL jika ada, atau semester paling awal dari list)
	const activeSemester = semesterParam || gpaSemesters[0]?.semester_name || '';

	let students : HighGpaStudentDTO[] = [];

	if (activeSemester) {
		// Cek apakah parameter berupa UUID (id) atau Nama Semester
		const isUuid = /^[0-9a-fA-F-]{36}$/.test(activeSemester);

		if (isUuid) {
			students = await getHighGpaStudentsBySemesterId(activeSemester);
		} else {
			students = await getHighGpaStudentsBySemesterName(activeSemester);
		}
	}

	return {
		selectedSemester: activeSemester,
		semesters: gpaSemesters,
		students
	};
};
