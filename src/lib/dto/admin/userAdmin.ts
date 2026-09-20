// gunakan untuk semua user , kecuali Administrator itu tetap yg buat ini web *Bgdar
export type RoleUser = 'Administrator' | 'Supervisor';

export interface  UserAdminDTO{
	id: string;
	name: string;
	username: string;
	email: string;
	password: string;
	role: 'Author' | RoleUser;
	status: 'Active' | 'Inactive';
	createdAt: string | Date | number;
}
