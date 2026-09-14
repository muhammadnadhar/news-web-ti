/// DTO
export interface AccreditationItemDTO {
	id: string;
	image_url: string | null;
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
	role: 'Dosen' | 'Staff';
	is_primary: boolean;
	photo_url: string | null;
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
	description: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export interface HistoryLeadersDTO {
	id: string;
	period: string;
	head_name: string;
	head_photo?: Buffer | string | null; // Buffer jika BLOB, string jika Base64 / URL
	secretary_name: string;
	secretary_photo?: Buffer | string | null; // Buffer jika BLOB, string jika Base64 / URL
	created_at?: Date;
	updated_at?: Date;
}
export type CreateHistoryContentData = Omit<HistoryContentDTO, 'id' | 'created_at' | 'updated_at'>;
export type CreateHistoryLeaderData = Omit<HistoryLeadersDTO, 'id' | 'created_at' | 'updated_at'>;

export interface OrgStructureItemDTO {
	id: string;
	title: string;
	image_url: string | null;
	description: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export type CreateOrgStructureData = Omit<OrgStructureItemDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateOrgStructureData = Partial<CreateOrgStructureData>;
