export interface PartnershipDTO {
	id: string;
	institution_name: string;
	logo_url: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export interface ActivityDocumentationDTO {
	id: string;
	title: string;
	image_url: string;
	description: string | null;
	event_date: string | null;
	created_at?: Date;
	updated_at?: Date;
}


