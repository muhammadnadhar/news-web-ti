// DTO

// Interface DTO
export interface JabatanProdiDTO {
	id: string;
	name: string;
	created_at: Date;
}

export interface AngkatanDTO {
	id: string;
	year: number;
	created_at?: Date;
	updated_at?: Date;
}

// Interface sesuai struktur kolom database
export interface SemesterDTO {
	id: string;
	name: string;
	academic_year: string;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
}

export type CreateSemesterInputDTO = {
	id: string;
	name: string;
	academic_year: string;
	is_active?: boolean;
};

export type UpdateSemesterInputDTO = {
	name: string;
	academic_year: string;
	is_active?: boolean;
};


// nantik akan di gunakna oleh table berita , forengkey ke sini
export interface NewsCategoryDTO {
	id: string;
	name: string;
	slug?: string | null;
	created_at?: Date | string;
	updated_at?: Date | string;
}

export type CreateNewsCategoryData = {
	name: string;
	slug?: string | null;
};

export type UpdateNewsCategoryData = {
	name?: string;
	slug?: string | null;
};

export interface CreateNewsData {
	title: string;
	category_id: string;
	content: string;
	image_url?: string | null;
	published_at?: Date | string;
}

export interface UpdateNewsData {
	title?: string;
	category_id?: string;
	content?: string;
	image_url?: string | null;
	published_at?: Date | string;
}


