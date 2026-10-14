import type { DashboardActionLink } from '$lib/types/dashboard';
import { BookOpen, GraduationCap, Library, UniversityIcon } from 'lucide-svelte';

// Objek data untuk tombol-tombol tautan eksternal/portal
export const actionDashboardLinks: DashboardActionLink[] = [
	{
		id: 'siakad',
		href: 'https://uinarraniry.siakadcloud.com/',
		label: 'Portal SIAKAD',
		icon: 'BookOpen',
		external: true,
		iconColorClass: 'text-accent-cyan'
	},
	{
		id: 'uin',
		href: 'https://ar-raniry.ac.id/',
		label: 'UIN AR-raniry',
		icon: 'GraduationCap',
		external: true,
		iconColorClass: 'text-accent-purple'
	},
	{
		id: 'saintek',
		href: 'https://fst.uin.ar-raniry.ac.id/',
		label: 'SAINTEKS',
		icon: 'UniversityIcon',
		external: true,
		iconColorClass: 'text-accent-purple'
	}
];
