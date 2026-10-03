import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { sessionAdmin } from '$lib/constants';
import { fail } from '@sveltejs/kit';
import { getUserById, updateUser } from '$lib/repository/admin/userAdmin';
import type {
	AvatarFormValues,
	PasswordFormValues,
	ProfileFormValues
} from '$lib/types/values/admin/user';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { Argon2id } from 'oslo/password';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

const login = '/admin/signIn';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const userId = locals.user?.id || cookies.get(sessionAdmin);

	if (!userId) {
		throw redirect(303, login);
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
	// Action 1: Update Avatar
	updateAvatar: async ({ request, locals, cookies }) => {
		const userId = locals.user?.id || cookies.get(sessionAdmin);
		if (!userId) throw redirect(303, login);

		const formData = await request.formData();

		// Ekstraksi data sesuai struktur AvatarFormValues (menggunakan image_url dan image_public_id)
		const values: AvatarFormValues = {
			image_url: formData.get('image_url')?.toString().trim() || '',
			image_public_id: formData.get('image_public_id')?.toString().trim() || ''
		};

		if (!values.image_url) {
			return fail(400, {
				...warningResponse('URL Gambar tidak valid.', 'Validasi Gagal'),
				values
			});
		}

		try {
			//  Ambil data user saat ini untuk mendapatkan public_id foto lama di Cloudinary
			const currentUser = await getUserById(userId); // Sesuaikan dengan fungsi fetch user repository Anda
			const oldPublicId = currentUser?.image_public_id;

			// Jika update database berhasil dan user sebelumnya punya foto lama di Cloudinary, hapus foto lama tersebut
			if (oldPublicId && oldPublicId !== values.image_public_id) {
				try {
					await deleteImageFromCloudinary(oldPublicId);
				} catch (deleteErr) {
					console.error('Gagal menghapus foto lama dari Cloudinary:', deleteErr);
					// Proses tetap dilanjutkan karena update database sudah sukses
				}
			}

			// Memanggil method update / updateProfileImage sesuai repository
			const success = await updateUser(userId, {
				image_url: values.image_url,
				image_public_id: values.image_public_id
			});

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal memperbarui foto profil.', 'Gagal Update'),
					values
				});
			}

			return successResponse('Foto profil berhasil diperbarui!', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating avatar:', err);
			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan sistem saat memperbarui avatar.',
					'Kesalahan Server'
				),
				values
			});
		}
	},

	// Action 2: Update Password
	updatePassword: async ({ request, locals, cookies }) => {
		const userId = locals.user?.id || cookies.get(sessionAdmin);
		if (!userId) throw redirect(303, login);

		const formData = await request.formData();

		const values: PasswordFormValues = {
			newPassword: formData.get('newPassword')?.toString() || ''
		};

		if (!values.newPassword || values.newPassword.length < 6) {
			return fail(400, {
				...warningResponse('Password minimal 6 karakter.', 'Validasi Gagal'),
				values
			});
		}

		try {
			// Jalankan hashing jika menggunakan Argon2id / bcrypt, lalu masukkan ke field password
			const hashedPassword = await new Argon2id().hash(values.newPassword);
			const success = await updateUser(userId, { password: hashedPassword });

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal mengubah password.', 'Gagal Update'),
					values
				});
			}

			return successResponse('Password berhasil diperbarui!', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating password:', err);
			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan sistem saat memperbarui password.',
					'Kesalahan Server'
				),
				values
			});
		}
	},

	// Action 3: Update Profile (Nama, Username, & Email)
	updateProfile: async ({ request, locals, cookies }) => {
		const userId = locals.user?.id || cookies.get(sessionAdmin);
		if (!userId) throw redirect(303, '/login');

		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe ProfileFormValues
		const values: ProfileFormValues = {
			name: formData.get('name')?.toString().trim() || '',
			username: formData.get('username')?.toString().trim() || '',
			email: formData.get('email')?.toString().trim() || ''
		};
		console.info(values);

		if (!values.name || !values.username || !values.email) {
			return fail(400, {
				...warningResponse('Nama, Username, dan Email wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const success = await updateUser(userId, {
				name: values.name,
				username: values.username,
				email: values.email
			});

			if (!success) {
				return fail(500, {
					...errorResponse('Gagal memperbarui profil.', 'Gagal Update'),
					values
				});
			}

			return successResponse('Data profil berhasil diperbarui!', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating profile:', err);

			// Pengecekan entri ganda untuk Email atau Username
			if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
				return fail(400, {
					...warningResponse('Email atau Username sudah digunakan oleh akun lain.', 'Gagal Update'),
					values
				});
			}

			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan sistem saat memperbarui profil.',
					'Kesalahan Server'
				),
				values
			});
		}
	}
};
