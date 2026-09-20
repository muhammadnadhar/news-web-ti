import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserById, updateUser, type UpdateUserData } from '$lib/repository/admin/userAdmin';
import { successResponse } from '$lib/helper/message';

/**
 * LOAD DATA:
 * Mengambil data user berdasarkan ID dari URL parameter
 */
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const user = await getUserById(id);

	if (!user) {
		throw error(404, {
			message: 'Pengguna tidak ditemukan'
		});
	}

	return {
		user
	};
};

/**
 * FORM ACTIONS:
 * Memproses perubahan data pengguna
 */
export const actions: Actions = {
	default: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const username = formData.get('username')?.toString().trim();
		const email = formData.get('email')?.toString().trim();
		const password = formData.get('password')?.toString();
		const role = formData.get('role')?.toString().trim();
		const status = formData.get('status')?.toString().trim();

		const values = { name, username, email, role, status };

		// 1. Validasi Input Wajib
		if (!name || !username || !email || !role || !status) {
			return fail(400, {
				error: 'Harap isi semua kolom yang wajib diisi.',
				values
			});
		}

		// Menyusun Objek Data yang Akan Diperbarui
		const updateData: UpdateUserData & { password?: string } = {
			name,
			username,
			email,
			role: role as any,
			status: status as any
		};

		// 3. Opsional: Kata Sandi (Hanya jika diisi/diubah)
		if (password && password.trim() !== '') {
			// CATATAN: Jika kata sandi perlu di-hash (misal menggunakan bcrypt/argon2),
			// lakukan proses hashing sebelum dimasukkan ke objek updateData:
			// updateData.password = await hashPassword(password);
			updateData.password = password;
		}

		try {
			// 4. Eksekusi Query Update
			const isSuccess = await updateUser(id, updateData);

			if (!isSuccess) {
				return fail(400, {
					error: 'Gagal memperbarui data user. Tidak ada perubahan yang disimpan.',
					values
				});
			}
		} catch (err: any) {
			console.error('Error saat update user:', err);
			return fail(500, {
				error: 'Terjadi kesalahan pada server saat memperbarui data.',
				values
			});
		}

		// Redirect jika berhasil
		// redirect(303, '/admin/users');
		return successResponse('Berhasil Editing data', ' Success');
	}
};
