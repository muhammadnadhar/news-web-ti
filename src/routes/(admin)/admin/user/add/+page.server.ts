import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from '$lib/server/crypto';
import type { UserAdminItem } from '$lib/types/admin/user';
import { checkUserExists, createUserAdmin } from '$lib/server/admin/repository/userAdmin';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const name = (data.get('name') as string)?.trim();
		const username = (data.get('username') as string)?.trim();
		const email = (data.get('email') as string)?.trim();
		const password = data.get('password') as string;
		const role = data.get('role') as UserAdminItem['role'];
		const status = (data.get('status') as UserAdminItem['status']) || 'Active';

		// Validasi Form Sederhana
		if (!name || !username || !email || !password || !role) {
			return fail(400, {
				error: 'Semua bidang wajib diisi.',
				values: { name, username, email, role, status }
			});
		}

		try {
			// Cek duplikasi Username/Email
			const { usernameExists, emailExists } = await checkUserExists(username, email);
			if (usernameExists) {
				return fail(400, {
					error: 'Username sudah digunakan oleh pengguna lain.',
					values: { name, username, email, role, status }
				});
			}
			if (emailExists) {
				return fail(400, {
					error: 'Email sudah terdaftar dalam sistem.',
					values: { name, username, email, role, status }
				});
			}

			// const id = crypto.randomUUID();
			const id = randomUUID();

			await createUserAdmin({
				id,
				name,
				username,
				email,
				password,
				role,
				status
			});

			// Arahkan ke daftar manajemen pengguna
			throw redirect(303, '/admin/users');
		} catch (err) {
			if (err instanceof Response) throw err;
			console.error('Gagal menambahkan user:', err);
			return fail(500, {
				error: 'Terjadi kesalahan sistem saat menyimpan user baru.',
				values: { name, username, email, role, status }
			});
		}
	}
};
