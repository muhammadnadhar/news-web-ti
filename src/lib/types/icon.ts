import { type ComponentIcon } from 'lucide-svelte';

export interface IconOption {
	name: string;
	label: string;
	component: ComponentIcon;
}

export interface IconColorOption {
	label: string;
	classValue: string; // Kelas CSS untuk warna teks / titik
	bgClass: string; // Kelas CSS untuk background saat dipilih
}
