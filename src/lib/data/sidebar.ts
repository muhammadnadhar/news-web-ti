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
		category: 'ARTIKEL',
		items: [
			{
				title: 'Home',
				iconName: 'Home',
				href: AdminUrl + '/artikel/home'
			},
			{
				title: 'Profil',
				iconName: 'BadgeIdentity',
				children: [
					{ title: 'Visi & Misi', href: AdminUrl + '/artikel/profil/visi-misi' },
					{ title: 'Sejarah Singkat', href: AdminUrl + '/artikel/profil/sejarah' },
					{ title: 'Dosen & Staf', href: AdminUrl + '/artikel/profil/dosen' },
					{ title: 'Fasilitas Lab', href: AdminUrl + '/artikel/profil/fasilitas' }
				]
			},
			{
				title: 'Akademik',
				iconName: 'GraduationCap',
				children: [
					{ title: 'Kalender Akademik', href: AdminUrl + '/artikel/akademik/kalender' },
					{ title: 'Jadwal Kuliah', href: AdminUrl + '/artikel/akademik/jadwal' },
					{ title: 'Akreditasi', href: AdminUrl + '/artikel/akademik/akreditasi' }
				]
			},
			{
				title: 'Kurikulum',
				iconName: 'BookOpen',
				children: [
					{ title: 'Capaian Pembelajaran', href: AdminUrl + '/artikel/kurikulum/cpl' },
					{ title: 'Daftar Mata Kuliah', href: AdminUrl + '/artikel/kurikulum/matakuliah' }
				]
			},
			{
				title: 'Kemahasiswaan',
				iconName: 'Users',
				children: [
					{ title: 'Himpunan (HMTI)', href: AdminUrl + '/artikel/kemahasiswaan/hmti' },
					{ title: 'Beasiswa', href: AdminUrl + '/artikel/kemahasiswaan/beasiswa' },
					{ title: 'Prestasi', href: AdminUrl + '/artikel/kemahasiswaan/prestasi' }
				]
			},
			{
				title: 'Penelitian',
				iconName: 'Microscope',
				children: [
					{ title: 'Riset Dosen', href: AdminUrl + '/artikel/penelitian/riset' },
					{ title: 'Jurnal TI', href: AdminUrl + '/artikel/penelitian/jurnal' }
				]
			},
			{
				title: 'Kerjasama',
				iconName: 'Handshake',
				children: [
					{ title: 'Mitra Industri', href: AdminUrl + '/artikel/kerjasama/industri' },
					{ title: 'Universitas Mitra', href: AdminUrl + '/artikel/kerjasama/universitas' }
				]
			},
			{
				title: 'Berita',
				iconName: 'Newspaper',
				children: [
					{ title: 'Pengumuman', href: AdminUrl + '/artikel/berita/pengumuman' },
					{ title: 'Agenda Kegiatan', href: AdminUrl + '/artikel/berita/agenda' }
				]
			}
		]
	}
];
