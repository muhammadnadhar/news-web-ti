import { fail, isRedirect, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { findUserByUsernameOrEmail } from '$lib/repository/admin/userAdmin';
import { sessionAdmin } from '$lib/constants';
export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const identifier = data.get('identifier') as string; // Username atau Email
		const password = data.get('password') as string;

		const values = { identifier };

		if (!identifier || !password) {
			return fail(400, {
				title: 'Validasi Gagal',
				message: 'Username/Email dan Password wajib diisi.',
				values
			});
		}

		try {
			const user = await findUserByUsernameOrEmail(identifier);

			if (!user || user.password !== password) {
				return fail(401, {
					title: 'Login Gagal',
					message: 'Kredensial (Username/Email atau Password) tidak valid.',
					values
				});
			}

			if (user.status !== 'Active') {
				return fail(403, {
					title: 'Akses Ditolak',
					message: 'Akun Anda sedang dinonaktifkan. Silakan hubungi administrator.',
					values
				});
			}

			cookies.set(sessionAdmin, user.id, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 // 1 hari
			});

			// Kembalikan response sukses tanpa langsung 'throw redirect'
			return {
				success: true,
				title: 'Login Berhasil',
				message: 'Selamat datang kembali! Anda akan dialihkan ke halaman admin dalam 3 detik...',
				redirectTo: '/admin'
			};
		} catch (err) {
			if (isRedirect(err)) throw err;
			console.error('Error saat login:', err);

			return fail(500, {
				title: 'Kesalahan Sistem',
				message: 'Terjadi kesalahan sistem, silakan coba lagi nanti.',
				values
			});
		}
	}
};
