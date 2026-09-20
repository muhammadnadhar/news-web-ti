export interface ScholarshipDTO {
	id: string;
	student_name: string;
	scholarship_name: string;
  image_url : string;
	created_at?: Date;
	updated_at?: Date;
}

export interface StudentAchievementDTO {
	id: string;
	student_name: string;
	is_academic: 'y' | 'n';
	batch_year: string;
	semester: string;
	achievement_name: string;
  image_url : string; 
	created_at?: Date;
	updated_at?: Date;
}

export interface HighGpaStudentDTO {
	id: string;
	student_name: string;
	gpa?: number;
	achievement_name?: string;
	is_academic?: string;
  image_url : string; 

	// Foreign Key Relations
	angkatan_id: string;
	semester_id: string;

	// Optional Joined Display Fields (dari hasil SQL JOIN)
	batch_year?: number;
	semester_name?: string;

	created_at?: Date;
	updated_at?: Date;
}
