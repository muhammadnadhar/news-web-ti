import type { InstructionOption } from '$lib/types/home';
import {
	Grid3X3,
	Layers,
	LayoutGrid,
	LayoutList,
	PanelLeft,
	PanelRight,
	Rows
} from 'lucide-svelte';

/**
 * Mengembalikan daftar opsi instruksi tata letak untuk form pilihan admin
 */
export const getInstructionOptions = (): InstructionOption[] => [
	{
		value: 'FLEX_CENTER',
		label: 'Flex Center',
		badge: 'Fleksibel',
		description: 'Flexbox rata tengah, otomatis rapi untuk 1, 2, atau banyak data.',
		icon: LayoutList
	},
	{
		value: 'GRID_DYNAMIC',
		label: 'Grid Dinamis',
		badge: 'Adaptif',
		description: 'Grid dinamis yang lebarnya otomatis menyesuaikan jumlah data.',
		icon: LayoutGrid
	},
	{
		value: 'GRID_3_COLS',
		label: 'Grid 3 Kolom',
		badge: 'Standar',
		description: 'Grid standar 3 kolom simetris untuk tampilan katalog.',
		icon: Grid3X3
	},
	{
		value: 'STACK_VERTICAL',
		label: 'Tumpuk Vertikal',
		badge: 'Feed List',
		description: 'Setiap kartu ditumpuk berurutan dari atas ke bawah.',
		icon: Rows
	},
	{
		value: 'MERGED_CARD',
		label: 'Merged Card',
		badge: 'Satu Wadah',
		description: 'Semua data digabung ke dalam 1 Card raksasa secara terpadu.',
		icon: Layers
	},
	{
		value: 'SPLIT_IMAGE_LEFT',
		label: 'Gambar Kiri (Split)',
		badge: 'Side-by-Side',
		description: 'Tata letak 2 kolom: Gambar di sebelah kiri dan deskripsi di sebelah kanan.',
		icon: PanelLeft
	},
	{
		value: 'SPLIT_IMAGE_RIGHT',
		label: 'Gambar Kanan (Split)',
		badge: 'Side-by-Side',
		description: 'Tata letak 2 kolom: Deskripsi di sebelah kiri dan gambar di sebelah kanan.',
		icon: PanelRight
	}
];
