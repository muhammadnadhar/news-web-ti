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

// Interface Data Profil Prodi
export interface ProfilProdiItemDTO {
	id: string;
	title: string;
	description: string;
	image_url: string | null;
	created_at?: Date | string;
	updated_at?: Date | string;
}
