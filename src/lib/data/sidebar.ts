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
				iconName: 'GraduationCap',
				href: AdminUrl + '/dataset/angkatan'
			},
			{
				title: 'Jabatan Prodi',
				iconName: 'UserCog',
				href: AdminUrl + '/dataset/jabatan-prodi'
			},
			{
				title: 'Kategori Berita',
				iconName: 'FolderTree',
				href: AdminUrl + '/dataset/kategori-berita'
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
			// {
			//     title: 'Home article ',
			//     iconName: 'Home',
			//     href: AdminUrl + '/article'
			// },
			{
				title: 'Profil',
				iconName: 'BadgeIdentity',
				children: [
					{
						title: 'Visi & Misi',
						iconName: 'Target',
						href: AdminUrl + '/article/profil/visi-misi'
					},
					{
						title: 'Sejarah Singkat',
						iconName: 'History',
						href: AdminUrl + '/article/profil/sejarah'
					},
					{
						title: 'Struktur Organisasi',
						iconName: 'Network',
						href: AdminUrl + '/article/profil/struktur-organisasi'
					},
					{
						title: 'Dosen & Staf',
						iconName: 'UserCheck',
						href: AdminUrl + '/article/profil/dosen'
					},
					{ title: 'Akreditasi', iconName: 'Award', href: AdminUrl + '/article/profil/akreditasi' },
					{
						title: 'Fasilitas Lab',
						iconName: 'FlaskConical',
						href: AdminUrl + '/article/profil/fasilitas'
					}
				]
			},
			{
				title: 'Akademik',
				iconName: 'GraduationCap',
				children: [
					{
						title: 'Kalender Akademik',
						iconName: 'Calendar',
						href: AdminUrl + '/article/akademik/kalender'
					},
					{
						title: 'Pedoman Tugas Akhir',
						iconName: 'FileText',
						href: AdminUrl + '/article/akademik/pedoman-ta'
					},
					{
						title: 'Pedoman KKP',
						iconName: 'Briefcase',
						href: AdminUrl + '/article/akademik/pedoman-kkp'
					},
					{
						title: 'Ketentuan Komprehensif',
						iconName: 'ClipboardList',
						href: AdminUrl + '/article/akademik/ketentuan-komprehensif'
					},
					{
						title: 'Modul Praktikum',
						iconName: 'BookMarked',
						href: AdminUrl + '/article/akademik/modul-praktikum'
					}
				]
			},
			{
				title: 'Kurikulum',
				iconName: 'BookOpen',
				children: [
					{ title: 'Kurikulum OBE', iconName: 'Layers', href: AdminUrl + '/article/kurikulum/obe' },
					{
						title: 'Daftar Mata Kuliah',
						iconName: 'ListOrdered',
						href: AdminUrl + '/article/kurikulum/matakuliah'
					}
				]
			},
			{
				title: 'Kemahasiswaan',
				iconName: 'Users',
				children: [
					{
						title: 'IPK Tertinggi',
						iconName: 'Trophy',
						href: AdminUrl + '/article/kemahasiswaan/ipktertinggi'
					},
					{
						title: 'Beasiswa',
						iconName: 'Award',
						href: AdminUrl + '/article/kemahasiswaan/beasiswa'
					},
					{
						title: 'Mahasiswa prestasi',
						iconName: 'Medal',
						href: AdminUrl + '/article/kemahasiswaan/mapres'
					}
				]
			},
			{
				title: 'Penelitian',
				iconName: 'Microscope',
				children: [
					{
						title: 'Penelitian Dosen',
						iconName: 'Search',
						href: AdminUrl + '/article/penelitian/penelitian-dosen'
					},
					{
						title: 'Publikasi Mahasiswa',
						iconName: 'FileUp',
						href: AdminUrl + '/article/penelitian/publikasi-mahasiswa'
					},
					{
						title: 'Publikasi Dosen',
						iconName: 'FileCheck2',
						href: AdminUrl + '/article/penelitian/publikasi-dosen'
					}
				]
			},
			{
				title: 'Kerjasama',
				iconName: 'Handshake',
				children: [
					{
						title: 'Mitra Industri',
						iconName: 'Building2',
						href: AdminUrl + '/article/kerjasama/daftar-kerjasama'
					},
					{
						title: 'Documentasi Kegiatan',
						iconName: 'Camera',
						href: AdminUrl + '/article/kerjasama/dokumentasi'
					}
				]
			},
			{
				title: 'Berita',
				iconName: 'Newspaper',
				children: [
					{ title: 'berita', iconName: 'Newspaper', href: AdminUrl + '/article/berita' }
					// { title: 'Agenda Kegiatan', iconName: 'CalendarDays', href: AdminUrl + '/article/berita/agenda' }
				]
			}
		]
	}
];
