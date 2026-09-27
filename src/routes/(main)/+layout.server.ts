import { getHighGpaSemesters } from '$lib/repository/admin/article/kemahasiswaan/ipkTertinggi';
import { getAchievementSemesters } from '$lib/repository/admin/article/kemahasiswaan/mapres';
import type { LayoutServerLoad } from './$types';
import { getRecentNews } from '$lib/repository/admin/article/berita';
import { getAllNewsCategories } from '$lib/repository/admin/dataset/beritaKategory';

export const load: LayoutServerLoad = async () => {
	// let academicSemesters: { semester: string }[] = [];
	// let nonAcademicSemesters: { semester: string }[] = [];
	// let gpaSemesters: { semester: string }[] = [];
	//
	try {
		const results = await Promise.allSettled([
			getAchievementSemesters('y'),
			getAchievementSemesters('n'),
			getHighGpaSemesters(),

			// untuk berita | Rencanaya data nya akan di cache , jaidnya lebih cepat
			getRecentNews(5),
			getAllNewsCategories()
		]);

	

		// Fetch semua data semester unik secara paralel dari masing-masing tabel/kategori
		// [academicSemesters, nonAcademicSemesters, gpaSemesters] = await Promise.all([
		// 	getAchievementSemesters('y'),
		// 	getAchievementSemesters('n'),
		// 	getHighGpaSemesters()
		// ]);

		return {
			// navItems: navMenuItems as NavMenuItemType[]
			semesters: {
				academic:  results[0].status === 'fulfilled' ? results[0].value : [],
				nonAcademic: results[1].status === 'fulfilled' ? results[1].value : [],
				gpa: results[2].status === 'fulfilled' ? results[2].value : [],
			},

			// data untuk berita
			recentNews: results[3].status === "fulfilled"  ? results[3].value : [],
			newsCategories: results[4].status === "fulfilled"  ? results[4].value :[],
		};
	} catch (error) {
		console.error('Gagal mengambil data dropdown semester:', error);
return {
            semesters: { academic: [], nonAcademic: [], gpa: [] },
            recentNews: [],
            newsCategories: []
        };
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
