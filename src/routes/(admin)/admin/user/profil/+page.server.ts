import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { sessionAdmin } from '$lib/types/session';
import { getUserById, updateUser } from '$lib/server/admin/repository/userAdmin';
import { fail } from 'assert';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const userId = locals.user?.id || cookies.get(sessionAdmin);

	if (!userId) {
		throw redirect(303, '/login');
	}

	try {
		// const user = await getUserById(userId);
		//
		// if (!user) {
		// 	throw error(404, {
		// 		message: 'Data profil pengguna tidak ditemukan atau telah dihapus.'
		// 	});
		// }
		return {
			user: getUserById(userId) // loading di clinet
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err; // Lempar kembali jika ini adalah redirect / error SvelteKit
		}

		console.error('Gagal memuat halaman profil:', err);
		throw error(500, {
			message: 'Terjadi kesalahan sistem saat mengambil data profil.'
		});
	}
};

export const actions: Actions = {
	// Action  Update Avatar dari Cloudinary
	updateAvatar: async ({ request, locals, cookies }) => {
		const userId = locals.user?.id || cookies.get('sessionAdmin');
		if (!userId) throw redirect(303, '/login');

		const formData = await request.formData();
		const avatarUrl = formData.get('avatarUrl') as string;

		if (!avatarUrl) {
			return fail(400, {
				success: false,
				status: 'warning' as const,
				title: 'Validasi Gagal',
				message: 'URL Gambar tidak valid'
			});
		}

		const success = await updateUser(userId, { avatar: avatarUrl });
		if (!success)
			return fail(500, {
				success: false,
				status: 'error' as const,
				title: 'Gagal',
				message: 'Gagal memperbarui avatar'
			});
		return {
			success: true,
			status: 'success' as const,
			title: 'Berhasil',
			message: 'Foto profil berhasil diperbarui!'
		};
	},

	// Action Update Password
	updatePassword: async ({ request, locals, cookies }) => {
		const userId = locals.user?.id || cookies.get('sessionAdmin');
		if (!userId) throw redirect(303, '/login');

		const formData = await request.formData();
		const newPassword = formData.get('newPassword') as string;

		if (!newPassword || newPassword.length < 6) {
			return fail(400, {
				success: false,
				status: 'warning' as const,
				title: 'Validasi Gagal',
				message: 'Password minimal 6 karakter'
			});
		}

		// Jalankan hashing jika Anda menggunakan bcrypt/argon2
		// const hashedPassword = await hashPassword(newPassword);
		const success = await updateUser(userId, { password: newPassword });

		if (!success)
			return fail(500, {
				success: false,
				status: 'error' as const,
				title: 'Gagal',
				message: 'Gagal mengubah password'
			});

		return {
			success: true,
			status: 'success' as const,
			title: 'Berhasil',
			message: 'Password berhasil diperbarui!'
		};
	},

	// Action 3: Update Profile (Nama & Email)
	updateProfile: async ({ request, locals, cookies }) => {
		const userId = locals.user?.id || cookies.get('sessionAdmin');
		if (!userId) throw redirect(303, '/login');

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;

		if (!name || !email) {
			return fail(400, {
				success: false,
				status: 'warning' as const,
				title: 'Validasi Gagal',
				message: 'Nama dan Email wajib diisi'
			});
		}

		const success = await updateUser(userId, { name, email });
		if (!success)
			return fail(500, {
				success: false,
				status: 'error' as const,
				title: 'Gagal',
				message: 'Gagal memperbarui profil'
			});
		return {
			success: true,
			status: 'success' as const,
			title: 'Berhasil',
			message: 'Data profil berhasil diperbarui!'
		};
	}
};
