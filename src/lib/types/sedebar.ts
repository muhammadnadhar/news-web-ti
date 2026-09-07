export interface SubMenuItem {
	title: string;
	href: string;
}

export interface MenuItem {
	title: string;
	iconName: string;
	href?: string;
	children?: SubMenuItem[];
}

export interface MenuCategory {
	category: string;
	items: MenuItem[];
}

export const AdminUrl = '/admin';
