import type { DisplayInstructionType } from '$lib/types/home';

// Mapper Class untuk Kontainer Utama (Outer Wrapper)
export function getContainerLayoutClass(
	instruction: DisplayInstructionType | string,
	itemCount: number = 0
): string {
	switch (instruction) {
		case 'FLEX_CENTER':
			return 'flex flex-wrap justify-center gap-6 w-full';

		case 'GRID_3_COLS':
			return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full';

		case 'STACK_VERTICAL':
			return 'flex flex-col items-center gap-6 w-full';

		case 'MERGED_CARD':
			// Berubah menjadi 1 Card besar tunggal yang membungkus semua elemen
			return 'flex flex-col border border-border-color bg-bg-secondary p-6 shadow-[0_4px_0_0_var(--border-color)] w-full divide-y divide-border-color';

		case 'GRID_DYNAMIC':
			if (itemCount === 1) return 'grid grid-cols-1 max-w-xl mx-auto gap-6 w-full';
			if (itemCount === 2) return 'grid grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto gap-6 w-full';
			return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full';

		case 'SPLIT_IMAGE_LEFT':
			// Layout 2 Kolom: Gambar/Visual di Kiri, Konten/Teks di Kanan
			return 'flex flex-col lg:flex-row items-center gap-8 w-full max-w-6xl mx-auto';

		case 'SPLIT_IMAGE_RIGHT':
			// Layout 2 Kolom: Gambar/Visual di Kanan, Konten/Teks di Kiri (menggunakan flex-row-reverse)
			return 'flex flex-col lg:flex-row-reverse items-center gap-8 w-full max-w-6xl mx-auto';

		default:
			return 'flex flex-wrap justify-center gap-6 w-full';
	}
}

// Mapper Class untuk Setiap Item/Card di Dalam Loop
export function getItemLayoutClass(instruction: DisplayInstructionType | string): string {
	switch (instruction) {
		case 'STACK_VERTICAL':
			return 'w-full max-w-2xl';

		case 'MERGED_CARD':
			// Jika digabung dalam 1 card, hilangkan border/shadow tiap item
			return 'w-full py-4 first:pt-0 last:pb-0';

		case 'SPLIT_IMAGE_LEFT':
		case 'SPLIT_IMAGE_RIGHT':
			// Pada mode split, setiap kolom mengambil porsi selebar 50% di layar besar (lg)
			return 'w-full lg:w-1/2 flex-1';

		case 'FLEX_CENTER':
		case 'GRID_3_COLS':
		case 'GRID_DYNAMIC':
		default:
			return 'w-full max-w-sm';
	}
}

/**
 * Helper untuk mengatur urutan elemen internal (misal: Gambar vs Teks)
 * jika komponen menggunakan struktur tunggal internal.
 */
export function getSplitOrderClass(
	instruction: DisplayInstructionType | string,
	target: 'image' | 'content'
): string {
	if (instruction === 'SPLIT_IMAGE_RIGHT') {
		return target === 'image' ? 'order-1 lg:order-2' : 'order-2 lg:order-1';
	}
	if (instruction === 'SPLIT_IMAGE_LEFT') {
		return target === 'image' ? 'order-1' : 'order-2';
	}
	return '';
}
