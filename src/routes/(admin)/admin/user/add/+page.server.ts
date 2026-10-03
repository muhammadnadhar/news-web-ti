import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { UserAdminDTO } from '$lib/dto/admin/userAdmin';
import { checkUserExists, createUserAdmin } from '$lib/repository/admin/userAdmin';
import { randomUUID } from '$lib/crypto';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { Argon2id } from 'oslo/password';
import type { UserFormValues } from '$lib/types/values/admin/user';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const values: UserFormValues = {
			id: (data.get('id') as string)?.trim() || randomUUID(),
			name: (data.get('name') as string)?.trim() || '',
			username: (data.get('username') as string)?.trim() || '',
			email: (data.get('email') as string)?.trim() || '',
			password: (data.get('password') as string) || '',
			role: (data.get('role') as string)?.trim() || '',
			status: (data.get('status') as string)?.trim() || 'Active'
		};

		if (!values.name || !values.username || !values.email || !values.password || !values.role) {
			return fail(400, {
				...warningResponse('Semua bidang wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const { usernameExists, emailExists } = await checkUserExists(values.username, values.email);
			if (usernameExists) {
				return fail(400, {
					...warningResponse('Username sudah digunakan oleh pengguna lain.', 'Gagal Simpan'),
					values
				});
			}
			if (emailExists) {
				return fail(400, {
					...warningResponse('Email sudah terdaftar dalam sistem.', 'Gagal Simpan'),
					values
				});
			}

			let passHash = '';
			try {
				passHash = await new Argon2id().hash(values.password);
			} catch (err: any) {
				console.error('Error hashing password:', err);
				return fail(429, {
					...errorResponse(
						'Terjadi kesalahan sistem saat mengamankan kata sandi.',
						'Gagal Hashing'
					),
					values
				});
			}

			await createUserAdmin({
				id: values.id!,
				name: values.name,
				username: values.username,
				email: values.email,
				password: passHash,
				role: values.role as UserAdminDTO['role'],
				status: values.status as UserAdminDTO['status']
			});

			return successResponse('Berhasil menambah user baru.', 'Berhasil');
		} catch (err: any) {
			if (err instanceof Response) throw err;
			console.error('Gagal menambahkan user:', err);

			// Pengecekan entri ganda / duplicate entry database
			if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
				return fail(400, {
					...warningResponse('Username atau Email sudah terdaftar pada user lain.', 'Gagal Simpan'),
					values
				});
			}

			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan sistem saat menyimpan user baru.',
					'Kesalahan Server'
				),
				values
			});
		}
	}
};
