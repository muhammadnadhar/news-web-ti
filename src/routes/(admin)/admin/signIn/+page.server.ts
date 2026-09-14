import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { findUserByUsernameOrEmail } from '$lib/server/admin/repository/userAdmin';
import { sessionAdmin } from '$lib/types/session';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const identifier = data.get('identifier') as string; // Bisa username atau email
		const password = data.get('password') as string;

		if (!identifier || !password) {
			return fail(400, { error: 'Username/Email dan Password wajib diisi.' });
		}

		try {
			const user = await findUserByUsernameOrEmail(identifier);

			if (!user) {
				return fail(401, { error: 'Kredensial tidak valid.' });
			}

			// Cek Password ( nantik disarankan menggunakan bcrypt.compare di tahap produksi)
			if (user.password !== password) {
				return fail(401, { error: 'Kredensial tidak valid.' });
			}

			if (user.status !== 'Active') {
				return fail(403, { error: 'Akun Anda sedang dinonaktifkan.' });
			}

			cookies.set(sessionAdmin, user.id, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 // 1 hari
			});

			throw redirect(303, '/admin');
		} catch (err) {
			if (err instanceof Response) throw err; // Penting untuk fungsi SvelteKit redirect()
			console.error('Error saat login:', err);
			return fail(500, { error: 'Terjadi kesalahan sistem, silakan coba lagi nanti.' });
		}
	}
};
