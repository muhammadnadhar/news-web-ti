export interface ScholarshipDTO {
	id: string;
	student_name: string;
	scholarship_name: string;
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
	created_at?: Date;
	updated_at?: Date;
}

export interface HighGpaStudentDTO {
	id: string;
	student_name: string;
	gpa: number;
	batch_year: string;
	semester: string;
	created_at?: Date;
	updated_at?: Date;
}
