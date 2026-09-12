import { type ComponentIcon , type Component } from 'lucide-svelte';

export interface SubMenuItem {
	id: string;
	label: string;
	href: string;
  subMenu? : SubMenuItem[];
}

export interface NavMenuItemType {
	id: string;
	label: string;
	icon: ComponentIcon | Component;
	bgClass: string;
	badge?: number | null;
	href?: string;
	subMenu: SubMenuItem[];
}
