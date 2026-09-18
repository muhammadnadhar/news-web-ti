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
