import type { ImageItem } from '../home';

export interface CourseMapDTO {
	id: string;
	title: string;
	image_url: string;
	image_public_id?: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export interface CurriculumDTO {
	id: string;
	description: string;
	title: string; // DTO / KKN dan lainya
	created_at?: Date;
	images?: ImageItem[]; // Array berisi daftar gambar dinamis
	updated_at?: Date;
}
export interface CurriculumNavDTO {
	id: string;
	title: string; // DTO / KKN dan lainya
}
