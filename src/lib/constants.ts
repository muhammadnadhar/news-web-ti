// Sesion
export const sessionAdmin = 'session_admin_id';

export const classTopSpace = 'pt-24 sm:pt-28 lg:pt-32'; // jarak ke atas , agar element tidak mendekati atas

export const classShadowDown =
	' shadow-[0_6px_0_0_var(--border-color)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_0_0_var(--border-color)]';

// secara default di gunakan
export const Author: { username: string; name: string; password: string; email: string } = {
	username: 'bgdar',
	email: 'author@gmail.com',
	password: 'daraja',
	name: 'Muhammad Nadhar'
};

// Palette Warna Tailwind Preset
export const bgColors = [
	{ name: 'Transparent', class: 'bg-transparent' },
	{ name: 'Primary Glare', class: 'bg-bg-primary-glare' },
	{ name: 'Secondary', class: 'bg-bg-secondary' },
	{ name: 'Accent Soft', class: 'bg-accent-primary/20' },
	{ name: 'Error Soft', class: 'bg-status-error/20' },
	{ name: 'Emerald Soft', class: 'bg-emerald-500/20' }
];

export const fgColors = [
	{ name: 'Default Main', class: 'text-text-main' },
	{ name: 'Muted', class: 'text-text-muted' },
	{ name: 'Accent Primary', class: 'text-accent-primary' },
	{ name: 'Error Red', class: 'text-status-error' },
	{ name: 'Emerald Green', class: 'text-emerald-400' },
	{ name: 'Amber Yellow', class: 'text-amber-400' }
];
