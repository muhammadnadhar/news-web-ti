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
	angkatan_id: string; // Foreign Key ke tabel Angkatan (id)
	semester_id: string; // Foreign Key ke tabel Semester (id)
	achievement_name: string;
	image_url: string | null;
	created_at?: Date;
	updated_at?: Date;

	// field opsional (bisa diisi saat query menggunakan join untuk kebutuhan ui)
	batch_year?: number; // Mengambil year dari AngkatanDTO
	semester_name?: string; // Mengambil name dari SemesterDTO
	academic_year?: string; // Mengambil academic_year dari SemesterDTO
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
