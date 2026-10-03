export interface NewsFormValues {
	title: string;
	category: string;
	content: string;
	image_url: string | null;
	imageId: string | null; // atau image_public_id sesuai standar penamaan Anda
}

// ------- Profile ----------
export interface FasilitasFormValues {
	name: string;
	id?: string;
	category: string;
	brandModel: string | null;
	description: string | null;
	image_url: string | null;
	image_public_id: string | null;
	sopLink: string | null;
}

// --------------- Akademic ----------
export interface CalendarFormValues {
	id?: string;
	title: string;
	description: string | null;
	isActive: boolean;
	retainedImageIds: string[];
	newImageUrls: string[];
}
export interface KetentuanKomprehensifFormValues {
	id?: string;
	title: string;
	image_url: string | null;
	image_public_id: string | null;
	description: string | null;
}
export interface ModulPraktikumFormValues {
	id?: string;
	title: string;
	image_url: string | null;
	image_public_id: string | null;
	description: string | null;
}

export interface PedomanKkpFormValues {
	title: string;
	id?: string;
	image_url: string | null;
	image_public_id: string | null;
	description: string | null;
}
export interface PedomanTaFormValues {
	id?: string;
	title: string;
	image_url: string | null;
	image_public_id: string | null;
	description: string | null;
}

// ------------- article / kemahasiswaan ---------
export interface BeasiswaFormValues {
	id?: string;
	student_name: string;
	scholarship_name: string;
	image_url: string | null;
	image_public_id: string | null;
}
export interface IpkTertinggiFormValues {
	id?: string;
	student_name: string;
	gpa: number;
	angkatan_id: string;
	semester_id: string;
	image_url: string | null;
	image_public_id: string | null;
}
export interface MapresFormValues {
	id?: string;
	student_name: string;
	achievement_name: string;
	is_academic: string;
	batch_year: string;
	semester: string;
	image_url: string | null;
	image_public_id: string | null;
}

/// ------ article / kerjasams
export interface KerjasamaFormValues {
	id?: string;
	institution_name: string;
	logo_url: string | null;
	public_id: string | null;
}
export interface DocumentationFormValues {
	id?: string;
	title: string;
	image_url: string;
	image_public_id?: string | null;
	event_date?: string | null;
	description?: string | null;
	link_drive?: string | null;
}

// ------- article / kurikulum
export interface CourseMapFormValues {
	id?: string;
	title: string;
	image_url: string | null;
	image_public_id?: string | null;
}
export interface ObeFormValues {
	description: string;
}

// --------- article / penelitian
export interface LecturerResearchFormValues {
	description: string;
}
export interface LecturerPublicationFormValues {
	id?: string;
	lecturer_id: string;
	sinta_link: string | null;
	scholar_link: string | null;
}
export interface StudentPublicationFormValues {
	id?: string;
	student_name: string;
	journal_list: string;
}

// ---------- article /profile
export interface AccreditationFormValues {
	id?: string;
	description: string;
	image_url: string;
	image_public_id: string | null;
}
export interface LecturerStaffFormValues {
	id?: string;
	name: string;
	nidn: string | null;
	expertise: string;
	pddikti_url: string | null;
	category: 'Dosen' | 'Staff';
	photo_url: string | null;
	photo_public_id: string | null;
}
// seajarah pada leder nya
export interface HistoryLeaderFormValues {
	id?: string;
	period: string;
	head_id: string | null;
	secretary_id: string | null;
}
export interface OrgStructureFormValues {
	id?: string;
	title: string;
	image_url: string | null;
	image_public_id: string | null;
	description: string | null;
}
export interface VisiMisiFormValues {
	id?: string;
	content: string;
}
