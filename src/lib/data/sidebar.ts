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
		category: 'HOME',
		items: [
			{
				title: 'Home',
				iconName: 'Home',
				href: AdminUrl + '/home'
			}
		]
	},
	{
		category: 'article',
		items: [
			{
				title: 'Home article ',
				iconName: 'Home',
				href: AdminUrl + '/article'
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
					{ title: 'Capaian Pembelajaran', href: AdminUrl + '/article/kurikulum/obe' },
					{ title: 'Daftar Mata Kuliah', href: AdminUrl + '/article/kurikulum/matakuliah' }
				]
			},
			{
				title: 'Kemahasiswaan',
				iconName: 'Users',
				children: [
					{ title: 'IPK Tertinggi', href: AdminUrl + '/article/kemahasiswaan/ipktertinggi' },
					{ title: 'Beasiswa', href: AdminUrl + '/article/kemahasiswaan/beasiswa' },
					{ title: 'Mahasiswa prestasi', href: AdminUrl + '/article/kemahasiswaan/mapres' }
				]
			},
			{
				title: 'Penelitian',
				iconName: 'Microscope',
				children: [
					{ title: 'Penelitian Dosen', href: AdminUrl + '/article/penelitian/penelitian-dosen' },
					{
						title: 'Publikasi Mahasiswa',
						href: AdminUrl + '/article/penelitian/publikasi-mahasiswa'
					},
					{ title: 'Publikasi Dosen', href: AdminUrl + '/article/penelitian/publikasi-dosen' }
				]
			},
			{
				title: 'Kerjasama',
				iconName: 'Handshake',
				children: [
					{ title: 'Mitra Industri', href: AdminUrl + '/article/kerjasama/daftar-kerjasama' },
					{ title: 'Documentasi Kegiatan', href: AdminUrl + '/article/kerjasama/documentasi' }
				]
			},
			{
				title: 'Berita',
				iconName: 'Newspaper',
				children: [
					{ title: 'berita', href: AdminUrl + '/article/berita' }
					// 	{ title: 'Agenda Kegiatan', href: AdminUrl + '/article/berita/agenda' }
				]
			}
		]
	}
];
