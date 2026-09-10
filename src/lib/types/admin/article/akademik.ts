export interface AcademicCalendarDTO {
	id: string;
	title: string;
	description: string | null;
	is_active: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface CalendarImageDTO {
	id: string;
	calendar_id: string;
	image_url: string;
}

export interface PedomanTaDTO {
	id: string;
	title: string;
	image_url: string | null;
	description: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export interface PedomanKkpDTO {
	id: string;
	title: string;
	image_url: string | null;
	description: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export interface PracticumModuleDTO {
	id: string;
	title: string;
	image_url: string | null;
	description: string | null;
	created_at?: Date;
	updated_at?: Date;
}


export interface KetentuanKompreDTO {
	id: string;
	title: string;
	image_url: string | null;
	description: string | null;
	created_at?: Date;
	updated_at?: Date;
}




