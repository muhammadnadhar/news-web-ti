// Mendefinisikan tipe data untuk tombol tautan
export interface DashboardActionLink {
	id: string;
	href: string;
	label: string;
	icon: string;
	external?: boolean;
	iconColorClass: string;
}
