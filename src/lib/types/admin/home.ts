

// Interface Data Dosen
export interface DosenItemDTO {
	id: string;
	name: string;
	position: string;
	image_url: string;
	created_at?: Date | string;
	updated_at?: Date | string;
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
