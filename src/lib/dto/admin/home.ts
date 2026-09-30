import type { DisplayInstructionType } from '$lib/types/home';

// Interface DTO disesuaikan dengan skema tabel
export interface ProfileDashboardDTO {
	id: string;
	title: string;
	image_path: string;
	image_public_id?: string | null;
	created_at?: Date | string;
	updated_at?: Date | string;
}

// Interface Data Dosen
export interface PrimaryDosenDTO {
	primary_id: string;
	lecturer_staff_id: string;
	position: string;
	name: string;
	nidn: string | null;
	expertise: string;
	photo_url: string | null;
	pddikti_url: string | null;
}

// Interface Data Perminatan TI
export interface PerminatanTIItemDTO {
	id: string;
	title: string;
	description: string;
	created_at?: Date | string;
	updated_at?: Date | string;
}
export interface ImageItem {
	url: string;
	public_id?: string | null;
	caption?: string;
}
// Interface Data Profil Prodi
export interface ProfilProdiItemDTO {
	id: string;
	title: string;
	description: string;
	images: ImageItem[]; // Array berisi daftar gambar dinamis
	image_public_id?: string | null;
	display_instruction?: DisplayInstructionType | string; // Instruksi tampilan dinamis
	created_at?: Date | string;
	updated_at?: Date | string;
}
