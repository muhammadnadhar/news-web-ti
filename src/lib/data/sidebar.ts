import { AdminUrl, type MenuCategory } from '$lib/types/sedebar';

export const sidebarMenu: MenuCategory[] = [
	{
		category: 'DASHBOARD',
		items: [
			{
				title: 'Dashboard',
				iconName: 'Gauge',
				href: AdminUrl + '/dashboard'
			}
		]
	},
	{
		category: 'USER CONF',
		items: [
			{
				title: 'User',
				iconName: 'UserCog',
				href: AdminUrl + '/user'
			}
		]
	},
	{
		category: 'DATASET',
		items: [
			{
				title: 'Semester',
				iconName: 'CalendarRange',
				href: AdminUrl + '/dataset/semester'
			},
			{
				title: 'Angkatan',
				iconName: 'Users',
				href: AdminUrl + '/dataset/angkatan'
			}
		]
	},
	{
		category: 'article',
		items: [
			{
				title: 'Home',
				iconName: 'Home',
				href: AdminUrl + '/article/home'
			},
			{
				title: 'Profil',
				iconName: 'BadgeIdentity',
				children: [
					{ title: 'Visi & Misi', href: AdminUrl + '/article/profil/visi-misi' },
					{ title: 'Sejarah Singkat', href: AdminUrl + '/article/profil/sejarah' },
					{ title: 'Struktur Organisasi', href: AdminUrl + '/article/profil/struktur-organisasi' },
					{ title: 'Dosen & Staf', href: AdminUrl + '/article/profil/dosen' },
					{ title: 'Akreditasi', href: AdminUrl + '/article/profil/akreditasi' },
					{ title: 'Fasilitas Lab', href: AdminUrl + '/article/profil/fasilitas' }
				]
			},
			{
				title: 'Akademik',
				iconName: 'GraduationCap',
				children: [
					{ title: 'Kalender Akademik', href: AdminUrl + '/article/akademik/kalender' },
					{ title: 'Pedoman Tugas Akhir', href: AdminUrl + '/article/akademik/pedoman-ta' },
					{ title: 'Pedoman KKP', href: AdminUrl + '/article/akademik/pedoman-kkp' },
					{
						title: 'Ketentuan Komprehensif',
						href: AdminUrl + '/article/akademik/ketentuan-komprehensif'
					},
					{ title: 'Modul Praktikum', href: AdminUrl + '/article/akademik/modul-praktikum' }
				]
			},
			{
				title: 'Kurikulum',
				iconName: 'BookOpen',
				children: [
					{ title: 'Capaian Pembelajaran', href: AdminUrl + '/article/kurikulum/cpl' },
					{ title: 'Daftar Mata Kuliah', href: AdminUrl + '/article/kurikulum/matakuliah' }
				]
			},
			{
				title: 'Kemahasiswaan',
				iconName: 'Users',
				children: [
					{ title: 'Himpunan (HMTI)', href: AdminUrl + '/article/kemahasiswaan/hmti' },
					{ title: 'Beasiswa', href: AdminUrl + '/article/kemahasiswaan/beasiswa' },
					{ title: 'Prestasi', href: AdminUrl + '/article/kemahasiswaan/prestasi' }
				]
			},
			{
				title: 'Penelitian',
				iconName: 'Microscope',
				children: [
					{ title: 'Riset Dosen', href: AdminUrl + '/article/penelitian/riset' },
					{ title: 'Jurnal TI', href: AdminUrl + '/article/penelitian/jurnal' }
				]
			},
			{
				title: 'Kerjasama',
				iconName: 'Handshake',
				children: [
					{ title: 'Mitra Industri', href: AdminUrl + '/article/kerjasama/industri' },
					{ title: 'Universitas Mitra', href: AdminUrl + '/article/kerjasama/universitas' }
				]
			},
			{
				title: 'Berita',
				iconName: 'Newspaper'
				// children: [
				// 	{ title: 'Pengumuman', href: AdminUrl + '/article/berita/pengumuman' },
				// 	{ title: 'Agenda Kegiatan', href: AdminUrl + '/article/berita/agenda' }
				// ]
			}
		]
	}
];
