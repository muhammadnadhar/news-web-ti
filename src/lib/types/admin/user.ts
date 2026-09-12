// gunakan untuk semua user , kecuali Administrator itu tetap yg buat ini web *Bgdar
export type RoleUser = 'Dosen' | 'Operator' | 'Mahasiswa';

export interface UserAdminItem {
	id: string;
	name: string;
	username: string;
	role: 'Administrator' | RoleUser;
	status: 'Active' | 'Inactive';
	createdAt: string;
}
