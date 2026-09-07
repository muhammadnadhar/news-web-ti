import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export interface UserItem {
	id: string;
	name: string;
	username: string;
	role: 'Administrator' | 'Dosen' | 'Operator' | 'Mahasiswa';
	status: 'Active' | 'Inactive';
	createdAt: string;
}

// Data Dummy Server (Dapat diganti query database seperti Prisma/Drizzle)
let mockUsers: UserItem[] = [
	{
		id: 'usr-001',
		name: 'Aesha Durratul Nasihah',
		username: 'aesha',
		role: 'Administrator',
		status: 'Active',
		createdAt: '2025-01-15'
	},
	{
		id: 'usr-002',
		name: 'M. Fadhlan',
		username: 'simax17',
		role: 'Administrator',
		status: 'Active',
		createdAt: '2025-02-01'
	},
	{
		id: 'usr-003',
		name: 'Prodi TI',
		username: 'proditi',
		role: 'Administrator',
		status: 'Active',
		createdAt: '2025-02-10'
	},
	{
		id: 'usr-004',
		name: 'Dr. Munir, M.T.',
		username: 'munir_fst',
		role: 'Dosen',
		status: 'Active',
		createdAt: '2025-03-01'
	},
	{
		id: 'usr-005',
		name: 'Operator Lab TI',
		username: 'op_lab',
		role: 'Operator',
		status: 'Active',
		createdAt: '2025-03-12'
	}
];

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q')?.toLowerCase() || '';

	// Filter pencarian sederhana di tingkat server
	const filteredUsers = mockUsers.filter(
		(user) =>
			user.name.toLowerCase().includes(query) ||
			user.username.toLowerCase().includes(query) ||
			user.role.toLowerCase().includes(query)
	);

	return {
		users: filteredUsers,
		totalCount: mockUsers.length
	};
};

export const actions: Actions = {
	// Action Tambah User Baru
	addUser: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString();
		const username = formData.get('username')?.toString();
		const role = formData.get('role')?.toString() as UserItem['role'];

		if (!name || !username || !role) {
			return fail(400, { message: 'Semua bidang form harus diisi.' });
		}

		const newUser: UserItem = {
			id: `usr-${Date.now().toString().slice(-4)}`,
			name,
			username,
			role,
			status: 'Active',
			createdAt: new Date().toISOString().split('T')[0]
		};

		mockUsers = [newUser, ...mockUsers];

		return { success: true, action: 'create' };
	},

	// Action Hapus User
	deleteUser: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { message: 'ID User tidak valid.' });
		}

		mockUsers = mockUsers.filter((u) => u.id !== id);

		return { success: true, action: 'delete' };
	}
};
