// Item untuk daftar dengan preview gambar di bagian atas
export interface SidebarRecentItem {
	id: string | number;
	title: string;
	imageUrl: string;
	date?: string;
	href?: string;
}

// Item untuk daftar kategori/counter di bagian bawah
export interface SidebarCategoryItem {
	id: string | number;
	name: string;
	count: number;
	href?: string;
	children?: SidebarCategoryItem[]; // Mendukung sub-kategori seperti di gambar (contoh: Acra -> Akreditasi, Seminar, dst)
}

// Interface props utama untuk komponen SidebarWidget
export interface SidebarWidgetProps {
	recentTitle?: string;
	recentItems?: SidebarRecentItem[];
	categoryTitle?: string;
	categoryItems?: SidebarCategoryItem[];
	onRecentClick?: (item: SidebarRecentItem) => void;
	onCategoryClick?: (item: SidebarCategoryItem) => void;
}
