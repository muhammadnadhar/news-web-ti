import type { IconColorOption, IconOption } from '$lib/types/icon';

import {
	Home,
	BookOpen,
	GraduationCap,
	Building2,
	Laptop,
	Library,
	Folder,
	FileText,
	Settings,
	Users,
	Calendar,
	Award,
	LayoutDashboard,
	Briefcase,
	Globe,
	Building2Icon,
	UsersIcon,
	BookOpenIcon,
	SearchIcon,
	HandshakeIcon,
	Newspaper
} from 'lucide-svelte';

// Daftar master ikon yang bisa digunakan di seluruh UI
export const availableIcons: IconOption[] = [
	{ name: 'Home', label: 'Home', component: Home },
	{ name: 'BookOpen', label: 'Book Open', component: BookOpen },
	{ name: 'GraduationCap', label: 'Graduation Cap', component: GraduationCap },
	{ name: 'Building2', label: 'Building', component: Building2 },
	{ name: 'Building2Icon', label: 'Building 2 icon', component: Building2Icon },
	{ name: 'Laptop', label: 'Laptop', component: Laptop },
	{ name: 'Library', label: 'Library', component: Library },
	{ name: 'SearchIcon', label: 'SearchIcon', component: SearchIcon },
	{ name: 'HandshakeIcon', label: 'HandshakeIcon', component: HandshakeIcon },
	{ name: 'Folder', label: 'Folder', component: Folder },
	{ name: 'FileText', label: 'File Text', component: FileText },
	{ name: 'Newspaper', label: 'File Text', component: Newspaper },
	{ name: 'Settings', label: 'Settings', component: Settings },
	{ name: 'Users', label: 'Users', component: Users },
	{ name: 'UsersIcon', label: 'Users Icon', component: UsersIcon },
	{ name: 'Calendar', label: 'Calendar', component: Calendar },
	{ name: 'Award', label: 'Award', component: Award },
	{ name: 'LayoutDashboard', label: 'Dashboard', component: LayoutDashboard },
	{ name: 'Briefcase', label: 'Briefcase', component: Briefcase },
	{ name: 'Globe', label: 'Globe', component: Globe },
	{ name: 'BookOpenIcon', label: 'Book openI con', component: BookOpenIcon }
];

export const availableIconColors: IconColorOption[] = [
	{
		label: 'Cyan',
		classValue: 'text-accent-cyan',
		bgClass: 'bg-accent-cyan/10 text-accent-cyan'
	},
	{
		label: 'Primary',
		classValue: 'text-accent-primary',
		bgClass: 'bg-accent-primary/10 text-accent-primary'
	},
	{
		label: 'Purple',
		classValue: 'text-scitech-purple',
		bgClass: 'bg-scitech-purple/10 text-scitech-purple'
	},
	{
		label: 'Mint',
		classValue: 'text-scitech-mint',
		bgClass: 'bg-scitech-mint/10 text-scitech-mint'
	},
	{
		label: 'Success',
		classValue: 'text-status-success',
		bgClass: 'bg-status-success/10 text-status-success'
	},
	{
		label: 'Warning',
		classValue: 'text-status-warning',
		bgClass: 'bg-status-warning/10 text-status-warning'
	},
	{
		label: 'Error',
		classValue: 'text-status-error',
		bgClass: 'bg-status-error/10 text-status-error'
	},
	{
		label: 'Muted',
		classValue: 'text-text-muted',
		bgClass: 'bg-text-muted/10 text-text-muted'
	}
];
