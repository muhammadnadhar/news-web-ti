/// DTO
export interface AccreditationItemDTO {
	id: string;
	image_url: string | null;
	image_public_id?: string | null;
	description: string;
	created_at?: Date;
	updated_at?: Date;
}

export type CreateAccreditationData = Omit<
	AccreditationItemDTO,
	'id' | 'created_at' | 'updated_at'
>;
export type UpdateAccreditationData = Partial<CreateAccreditationData>;

export interface VisiMisiItemDTO {
	id: string;
	content: string;
	created_at?: Date;
	updated_at?: Date;
}

export type CreateVisiMisiData = Omit<VisiMisiItemDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateVisiMisiData = Partial<CreateVisiMisiData>;

export interface LecturerStaffItemDTO {
	id: string;
	name: string;
	nidn: string | null;
	expertise: string;
	is_primary: boolean;
	role: 'Dosen' | 'Staff';
	photo_url: string | null;
	photo_public_id: string | null;
	pddikti_url?: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export type CreateLecturerStaffData = Omit<
	LecturerStaffItemDTO,
	'id' | 'created_at' | 'updated_at'
>;
export type UpdateLecturerStaffData = Partial<CreateLecturerStaffData>;

// DTO History
export interface HistoryContentDTO {
	id: string;
	title: string;
	image_url: string | null;
	image_public_id?: string | null;
	description: string | null;
	created_at?: Date;
	updated_at?: Date;
}

// history kepemimpinan
export interface HistoryLeadersDTO {
	id: string;
	period: string;

	// Foreign Key ke Dosen & Staff
	head_id: string | null;
	secretary_id: string | null;

	// Optional: Properti hasil JOIN dengan tabel LecturerStaff
	head?: LecturerStaffItemDTO | null;
	secretary?: LecturerStaffItemDTO | null;

	// Optional: Jika query JOIN mengembalikan nilai pipelined/flattened langsung ke DTO UI
	head_name?: string | null;
	head_photo?: string | null;
	secretary_name?: string | null;
	secretary_photo?: string | null;

	created_at?: Date;
	updated_at?: Date;
}
export type CreateHistoryContentData = Omit<HistoryContentDTO, 'id' | 'created_at' | 'updated_at'>;
export type CreateHistoryLeaderData = Omit<HistoryLeadersDTO, 'id' | 'created_at' | 'updated_at'>;

export interface OrgStructureItemDTO {
	id: string;
	title: string;
	image_url: string | null;
	image_public_id?: string | null;
	description: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export type CreateOrgStructureData = Omit<OrgStructureItemDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateOrgStructureData = Partial<CreateOrgStructureData>;

// Fasilitas Section
export interface FacilityEntity {
	id: string;
	name: string;
	image_url: string | null;
	image_public_id?: string | null;
	brand_model: string | null;
	description: string | null;
	category: string;
	sop_url: string | null; // optional
	created_at: Date | string;
	updated_at: Date | string;
}

// DTO untuk Response API (CamelCase)
export interface FacilityResponseDTO {
	id: string;
	name: string;
	imageUrl: string | null;
	image_public_id?: string | null;
	brandModel: string | null;
	description: string | null;
	category: string;
	sopUrl: string | null;
	createdAt: Date | string;
	updatedAt: Date | string;
}

// DTO untuk Payload Membuat Fasilitas Baru (Create)
export interface CreateFacilityDTO {
	name: string;
	category: string;
	imageUrl?: string | null;
	image_public_id?: string | null;

	brandModel?: string | null;
	description?: string | null;
	sopUrl?: string | null;
}

// DTO untuk Payload Update Fasilitas (Update)
export type UpdateFacilityDTO = Partial<CreateFacilityDTO>;

// DTO untuk Filter Query & Paginasi
export interface FacilityFilterDTO {
	search?: string;
	category?: string;
	page?: number;
	limit?: number;
}
