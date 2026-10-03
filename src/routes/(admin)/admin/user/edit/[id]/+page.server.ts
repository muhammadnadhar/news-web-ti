import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserById, updateUser, type UpdateUserData } from '$lib/repository/admin/userAdmin';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import type { UserFormValues } from '$lib/types/values/admin/user';

/**
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
 * Memproses perubahan data pengguna
 */
export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();

		const passwordRaw = formData.get('password')?.toString();

		const values: UserFormValues = {
			id: params.id || (formData.get('id') as string)?.trim(),
			name: formData.get('name')?.toString().trim() || '',
			username: formData.get('username')?.toString().trim() || '',
			email: formData.get('email')?.toString().trim() || '',
			role: formData.get('role')?.toString().trim() || '',
			status: formData.get('status')?.toString().trim() || '',
			password: passwordRaw || ''
		};

		// Validasi ID
		if (!values.id) {
			return fail(400, {
				...errorResponse('ID User tidak ditemukan.', 'Validasi Gagal'),
				values
			});
		}

		// 1. Validasi Input Wajib
		if (!values.name || !values.username || !values.email || !values.role || !values.status) {
			return fail(400, {
				...warningResponse('Harap isi semua kolom yang wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		// Menyusun Objek Data yang Akan Diperbarui
		const updateData: UpdateUserData & { password?: string } = {
			name: values.name,
			username: values.username,
			email: values.email,
			role: values.role as any,
			status: values.status as any
		};

		if (values.password && values.password.trim() !== '') {
			updateData.password = values.password;
		}

		try {
			const isSuccess = await updateUser(values.id, updateData);

			if (!isSuccess) {
				return fail(400, {
					...warningResponse(
						'Gagal memperbarui data user. Tidak ada perubahan yang disimpan.',
						'Gagal Update'
					),
					values
				});
			}

			return successResponse('Berhasil memperbarui data user.', 'Berhasil');
		} catch (err: any) {
			console.error('Error saat update user:', err);

			// Pengecekan entri ganda / duplicate entry (Username atau Email)
			if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
				return fail(400, {
					...warningResponse('Username atau Email sudah terdaftar pada user lain.', 'Gagal Update'),
					values
				});
			}

			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan pada server saat memperbarui data user.',
					'Kesalahan Server'
				),
				values
			});
		}
	}
};
