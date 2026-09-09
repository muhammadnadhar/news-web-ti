export interface UserAdminItem {
	id: string;
	name: string;
	username: string;
	role: 'Administrator' | 'Dosen' | 'Operator' | 'Mahasiswa';
	status: 'Active' | 'Inactive';
	createdAt: string;
}
