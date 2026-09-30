// Daftar jenis instruksi layout
export type DisplayInstructionType =
	| 'FLEX_CENTER' // Flexbox rata tengah (Otomatis rapi untuk 1, 2, atau banyak data)
	| 'GRID_3_COLS' // Grid standar 3 kolom
	| 'STACK_VERTICAL' // Ditumpuk dari atas ke bawah
	| 'MERGED_CARD' // Semua data digabung ke dalam 1 Card raksasa
	| 'GRID_DYNAMIC' // Grid dinamis yang lebarnya menyesuaikan jumlah data
	| 'SPLIT_IMAGE_LEFT'
	| 'SPLIT_IMAGE_RIGHT';

export interface InstructionOption {
	value: DisplayInstructionType;
	label: string;
	badge: string;
	description: string;
	icon: any;
}
