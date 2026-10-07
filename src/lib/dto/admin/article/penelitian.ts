export interface LecturerPublicationDTO {
	id: string;
	lecturer_id: string; //  Foreign Key merujuk ke LecturerStaffItemDTO.id
	lecturer_name?: string; //  Diambil dari hasil JOIN dengan tableLecturerStaff
	nidn?: string | null; // (Opsional) jika ingin menampilkan NIDN dosen saat dipanggil
	sinta_link: string | null;
	scholar_link: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export interface StudentPublicationDTO {
	id: string;
	student_name: string;
	journal_list: string;
	image_url?: string | null;
	image_public_id?: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export interface LecturerResearchDTO {
	id: string;
	description: string;
	created_at?: Date;
	updated_at?: Date;
}
