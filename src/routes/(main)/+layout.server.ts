import { getHighGpaSemesters } from '$lib/repository/admin/article/kemahasiswaan/ipkTertinggi';
import { getAchievementSemesters } from '$lib/repository/admin/article/kemahasiswaan/mapres';
import { AwardIcon } from 'lucide-svelte';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	// let academicSemesters: { semester: string }[] = [];
	// let nonAcademicSemesters: { semester: string }[] = [];
	// let gpaSemesters: { semester: string }[] = [];
	//
	try {
		const results = await Promise.allSettled([
			getAchievementSemesters('y'),
			getAchievementSemesters("n"),
			getHighGpaSemesters()
		]);

		const academicSemesters = results[0].status === 'fulfilled' ? results[0].value : [];
		const nonAcademicSemesters = results[1].status === 'fulfilled' ? results[1].value : [];
		const gpaSemesters = results[2].status === 'fulfilled' ? results[2].value : [];

		// Fetch semua data semester unik secara paralel dari masing-masing tabel/kategori
		// [academicSemesters, nonAcademicSemesters, gpaSemesters] = await Promise.all([
		// 	getAchievementSemesters('y'),
		// 	getAchievementSemesters('n'),
		// 	getHighGpaSemesters()
		// ]);
    console.table(await getAchievementSemesters("y"))
    console.table(await getAchievementSemesters("n"))
		return {
			// navItems: navMenuItems as NavMenuItemType[]
			semesters: {
				academic: academicSemesters,
				nonAcademic: nonAcademicSemesters,
				gpa: gpaSemesters
			}
		};
	} catch (error) {
		console.error('Gagal mengambil data dropdown semester:', error);
	}

	// const kemahasiswaanMenu = navMenuItems.find((m: NavMenuItemType) => m.id === 'kemahasiswaan');
	//
	//   if (kemahasiswaanMenu && kemahasiswaanMenu.subMenu) {
	//
	//       // Inject ke Prestasi Akademik
	//       const prestasiAkademik = kemahasiswaanMenu.subMenu.find((c: SubMenuItem) => c.id === 'prestasi-akademik');
	//       if (prestasiAkademik) {
	//           prestasiAkademik.subMenu = formatSubMenu(academicSemesters, prestasiAkademik.href);
	//       }
	//
	//       // Inject ke Prestasi Non-Akademik
	//       const prestasiNonAkademik = kemahasiswaanMenu.subMenu.find((c: SubMenuItem) => c.id === 'prestasi-non-akademik');
	//       if (prestasiNonAkademik) {
	//           prestasiNonAkademik.subMenu = formatSubMenu(nonAcademicSemesters, prestasiNonAkademik.href);
	//       }
	//
	//       // Inject ke Mahasiswa IPK Tertinggi
	//       const ipkTertinggi = kemahasiswaanMenu.subMenu.find((c: SubMenuItem) => c.id === 'mahasiswa-ipk-tertinggi');
	//       if (ipkTertinggi) {
	//           ipkTertinggi.subMenu = formatSubMenu(gpaSemesters, ipkTertinggi.href);
	//       }
	// }
};
