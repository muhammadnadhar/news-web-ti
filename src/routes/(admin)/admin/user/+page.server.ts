import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { type UserItem } from './proxy+page.server';
import {
	createUser,
	deleteUser,
	getUsersAdmin,
	isUsernameTaken
} from '$lib/server/admin/repository/userAdmin';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('q')?.toLowerCase() || '';

	// Filter pencarian sederhana di tingkat server
	// const filteredUsers = mockUsers.filter(
	// 	(user) =>
	// 		user.name.toLowerCase().includes(query) ||
	// 		user.username.toLowerCase().includes(query) ||
	// 		user.role.toLowerCase().includes(query)
	// );
	//
	// return {
	// 	users: filteredUsers,
	// 	totalCount: mockUsers.length
	// };

	const limit = Number(url.searchParams.get('limit')) || 10;
	const page = Number(url.searchParams.get('page')) || 1;
	const offset = (page - 1) * limit;

	const { items, total } = await getUsersAdmin(search, limit, offset);
	return {
		users: items,
		totalCount: total
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

		// Validasi tambahan: Cek apakah username sudah terdaftar di database MySQL
		const usernameExists = await isUsernameTaken(username);
		if (usernameExists) {
			return fail(400, { message: 'Username sudah digunakan oleh orang lain.' });
		}

		const newUser: UserItem = {
			id: `usr-${Date.now().toString().slice(-4)}`,
			name,
			username,
			role,
			status: 'Active',
			createdAt: new Date().toISOString().split('T')[0]
		};

		console.table(newUser);

		// mockUsers = [newUser, ...mockUsers];
		// return { success: true, action: 'create' };
		try {
			// Simpan ke database MySQL
			await createUser(newUser);
			return { success: true, action: 'create' };
		} catch (error) {
			return fail(500, { message: 'Gagal menyimpan user ke database.' });
		}
	},

	// Action Hapus User
	deleteUser: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { message: 'ID User tidak valid.' });
		}

		// mockUsers = mockUsers.filter((u) => u.id !== id);
		// return { success: true, action: 'delete' };
		try {
			// Hapus dari database MySQL
			const isDeleted = await deleteUser(id);

			if (!isDeleted) {
				return fail(404, { message: 'User tidak ditemukan di database.' });
			}

			return { success: true, action: 'delete' };
		} catch (error) {
			return fail(500, { message: 'Gagal menghapus user dari database.' });
		}
	}
};
