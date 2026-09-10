export interface LecturerPublicationDTO {
	id: string;
	lecturer_name: string;
	sinta_link: string | null;
	scholar_link: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export interface StudentPublicationDTO {
	id: string;
	student_name: string;
	journal_list: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface LecturerResearchDTO {
	id: string;
	description: string;
	created_at?: Date;
	updated_at?: Date;
}


