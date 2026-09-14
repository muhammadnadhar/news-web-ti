import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { addProfilProdi } from '$lib/server/admin/repository/home/profilProdi';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const image_url = formData.get('image_url')?.toString().trim() || null;

		// Validasi Input
		if (!title || title.length > 150) {
			return fail(400, {
				success: false,
				status: 'warning' as const,
				title: 'Validasi Gagal',
				message: 'Judul profil wajib diisi dan maksimal 150 karakter.'
			});
		}

		if (!description) {
			return fail(400, {
				success: false,
				status: 'warning' as const,
				title: 'Validasi Gagal',
				message: 'Deskripsi profil wajib diisi.'
			});
		}

			// Memanggil fungsi addProfilProdi yang mengembalikan id (string)
			const id = await addProfilProdi({
				title,
				description,
				image_url
			});

			// Mengembalikan respons sukses tanpa redirect
			return {
				success: true,
				status: 'success' as const,
				title: 'Berhasil Disimpan!',
				message: 'Data profil prodi baru telah berhasil ditambahkan.',
				id
			};
		} catch (err) {
			console.error('Error in addProfilProdi:', err);
			return fail(500, {
				success: false,
				status: 'error' as const,
				title: 'Terjadi Kesalahan',
				message: 'Gagal menyimpan data ke database. Silakan coba beberapa saat lagi.'
			});
		}
	}
};
