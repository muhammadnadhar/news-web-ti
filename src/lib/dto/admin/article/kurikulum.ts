export interface CourseMapDTO {
	id: string;
	title: string;
	image_url: string;
	image_public_id?: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export interface ObeCurriculumDTO {
	id: string;
	description: string;
	created_at?: Date;
	updated_at?: Date;
}
