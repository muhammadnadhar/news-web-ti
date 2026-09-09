import type { MenuItem } from '$lib/types/navbar';
import { Building2, GraduationCap, Users, FlaskConical, Handshake, Newspaper } from 'lucide-svelte';

export const menuItems: MenuItem[] = [
	{
		id: 'profil',
		label: 'Profil',
		icon: Building2,
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
			{ id: 'pedoman-akademik', label: 'Pedoman Akademik', href: '/akademik/pedoman-akademik' },
			{ id: 'kalender-akademik', label: 'Kalender Akademik', href: '/akademik/kalender-akademik' },
			{
				id: 'pedoman-tugas-akhir',
				label: 'Pedoman Tugas Akhir',
				href: '/akademik/pedoman-tugas-akhir'
			},
			{
				id: 'pedoman-kkp',
				label: 'Pedoman Kuliah Kerja Praktek',
				href: '/akademik/pedoman-kuliah-kerja-praktek'
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
		icon: Users,
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
				href: '/kemahasiswaan/mahasiswa-ipk-tertinggi'
			},
			{ id: 'beasiswa', label: 'Beasiswa', href: '/kemahasiswaan/beasiswa' },
			{ id: 'hima-ti', label: 'HIMA TI', href: '/kemahasiswaan/hima-ti' }
		]
	},
	{
		id: 'penelitian',
		label: 'Penelitian',
		icon: FlaskConical,
		bgClass: 'bg-[#3e1b24] text-scitech-error hover:bg-scitech-error hover:text-white',
		badge: null,
		subMenu: []
	},
	{
		id: 'kerjasama',
		label: 'Kerjasama',
		icon: Handshake,
		bgClass: 'bg-scitech-slate hover:bg-scitech-slate-hover text-text-main',
		badge: null,
		subMenu: []
	},
	{
		id: 'berita',
		label: 'Berita',
		icon: Newspaper,
		bgClass:
			'bg-scitech-navy-glare text-scitech-mint hover:bg-scitech-mint hover:text-scitech-navy',
		badge: 2,
		subMenu: []
	}
];
