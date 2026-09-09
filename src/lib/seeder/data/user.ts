import type { UserAdminItem } from '$lib/types/admin/user';

export let mockAdminUsers: UserAdminItem[] = [
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
