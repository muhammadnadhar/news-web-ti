import { type Component } from 'lucide-svelte';

export interface SubMenuItem {
	id: string;
	label: string;
	href: string;
}

export interface NavMenuItemType {
	id: string;
	label: string;
	icon: Component;
	bgClass: string;
	badge?: number | null;
	href?: string;
	subMenu: SubMenuItem[];
}
