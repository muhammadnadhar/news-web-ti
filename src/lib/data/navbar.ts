import type { NavMenuItemType } from '$lib/types/navbar';
import {
	Building2,
	GraduationCap,
	Users,
	Newspaper,
	SearchIcon,
	HandshakeIcon,
	Building2Icon,
    UsersIcon
} from 'lucide-svelte';

// dari halaman utama menggunkan sub pages
// di sini menghandle langsung ke root tampa masuk ke sub director
export const navMenuItems: NavMenuItemType[] = [
	{
		id: 'profil',
		label: 'Profil',
		icon: Building2Icon,
		bgClass: 'bg-scitech-mint-dim text-scitech-mint hover:bg-scitech-mint hover:text-scitech-navy',
		badge: null,
		subMenu: [
			{ id: 'sejarah', label: 'Sejarah', href: '/profil/sejarah' },
			{ id: 'visi-misi', label: 'Visi, Misi & Tujuan', href: '/profil/visi-misi' },
			{
				id: 'struktur-organisasi',
				label: 'Struktur Organisasi',
				href: '/profil/struktur-organisasi'
			},
			{ id: 'dosen-staf', label: 'Dosen & Staf', href: '/profil/dosen-staf' },
			{ id: 'akreditasi', label: 'Akreditasi', href: '/profil/akreditasi' },
			{ id: 'kurikulum', label: 'Kurikulum', href: '/profil/kurikulum' }
		]
	},
	{
		id: 'akademik',
		label: 'Akademik',
		icon: GraduationCap,
		bgClass: 'bg-[#0e3043] text-scitech-cyan hover:bg-scitech-cyan hover:text-scitech-navy',
		badge: null,
		subMenu: [
			// { id: 'pedoman-akademik', label: 'Pedoman Akademik', href: '/akademik/pedoman-akademik' },
			{ id: 'kalender-akademik', label: 'Kalender Akademik', href: '/akademik/kalender' },
			{
				id: 'pedoman-tugas-akhir',
				label: 'Pedoman Tugas Akhir',
				href: '/akademik/pedoman-ta'
			},
			{
				id: 'pedoman-kkp',
				label: 'Pedoman Kuliah Kerja Praktek',
				href: '/akademik/pedoman-kkp'
			},
			{
				id: 'ketentuan-komprehensif',
				label: 'Ketentuan Komprehensif',
				href: '/akademik/ketentuan-komprehensif'
			},
			{ id: 'modul-praktikum', label: 'Modul Pratikum', href: '/akademik/modul-praktikum' }
		]
	},
	{
		id: 'kemahasiswaan',
		label: 'Kemahasiswaan',
		icon: UsersIcon,
		bgClass: 'bg-[#23224d] text-scitech-purple hover:bg-scitech-purple hover:text-scitech-navy',
		badge: null,
		subMenu: [
			{
				id: 'prestasi-akademik',
				label: 'Prestasi Akademik',
				href: '/kemahasiswaan/prestasi-akademik'
			},
			{
				id: 'prestasi-non-akademik',
				label: 'Prestasi Non-Akademik',
				href: '/kemahasiswaan/prestasi-non-akademik'
			},
			{
				id: 'mahasiswa-ipk-tertinggi',
				label: 'Mahasiswa IPK Tertinggi',
				href: '/kemahasiswaan/ipk-tertinggi'
			},
			{ id: 'beasiswa', label: 'Beasiswa', href: '/kemahasiswaan/beasiswa' },
			{ id: 'hima-ti', label: 'HIMA TI', href: '/kemahasiswaan/hima' }
		]
	},

	{
		id: 'penelitian',
		label: 'Penelitian',
		icon: SearchIcon, // Anda bisa mengganti 'Search' atau 'BookOpen' sesuai kebutuhan ikon Anda
		bgClass: 'bg-scitech-slate hover:bg-scitech-slate-hover text-text-main',
		badge: null,
		subMenu: [
			{
				id: 'publikasi-dosen',
				label: 'Publikasi Dosen',
				href: '/penelitian/publikasi-dosen'
			},
			{
				id: 'publikasi-mahasiswa',
				label: 'Publikasi Mahasiswa',
				href: '/penelitian/publikasi-mahasiswa'
			},
			{
				id: 'penelitian-dosen',
				label: 'Penelitian Dosen Prodi TI',
				href: '/penelitian/publikasi-dosen'
			},
			{
				id: 'jurnal-jintech',
				label: 'Jurnal JINTECH',
				href: '/penelitian/jurnal-jintech'
			}
		]
	},

	{
		id: 'kerjasama',
		label: 'Kerjasama',
		icon: HandshakeIcon, // Anda bisa mengganti 'Handshake' dengan ikon lucide-react yang sesuai
		bgClass: 'bg-[#23224d] text-scitech-purple hover:bg-scitech-purple hover:text-scitech-navy',
		badge: null,
		subMenu: [
			{
				id: 'daftar-kerjasama',
				label: 'Daftar Kerjasama',
				href: '/kerjasama/daftar-kerjasama'
			},
			{
				id: 'dokumentasi-kegiatan',
				label: 'Dokumentasi Kegiatan',
				href: '/kerjasama/dokumentasi-kegiatan'
			}
		]
	},
	{
		id: 'berita',
		label: 'Berita',
		icon: Newspaper,
		bgClass:
			'bg-scitech-navy-glare text-scitech-mint hover:bg-scitech-mint hover:text-scitech-navy',
		badge: 2,
		subMenu: [{ id: 'berita', label: 'Berita', href: '/berita' }]
	}
];
