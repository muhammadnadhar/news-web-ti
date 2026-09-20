import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { cloudinary } from '$lib/cloudinary/server';
import { addProfileDashboard } from '$lib/repository/admin/home/profileDashboard';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const title = (formData.get('title') as string)?.trim();

		// Menerima 'image_path' (bisa berupa URL lengkap atau Public ID)
		const image_path = (
			(formData.get('image_path') || formData.get('image_url')) as string
		)?.trim();
		// (Opsional) Menerima public_id terpisah jika dikirim dari frontend
		const public_id = (formData.get('public_id') as string)?.trim();

		// Validasi Input Mandatory
		if (!title || !image_path) {
			return fail(400, {
				message: {
					type: 'error',
					text: 'Judul dan Gambar wajib diisi!'
				},
				title,
				image_path
			});
		}

		try {
			// Simpan Data ke Database
			await addProfileDashboard({
				title,
				image_path
			});

			return {
				message: {
					type: 'success',
					text: 'Berhasil menambahkan Profile Dashboard baru!'
				}
			};
		} catch (error: any) {
			console.error('Database Error:', error);

			// best practice: auto-cleanup (hapus gambar dari cloudinary jika db gagal)
			if (public_id) {
				try {
					await cloudinary.uploader.destroy(public_id);
					console.log(`Berhasil menghapus file orphan dari Cloudinary: ${public_id}`);
				} catch (cleanupError) {
					console.error('Gagal melakukan cleanup Cloudinary:', cleanupError);
				}
			}

			return fail(500, {
				message: {
					type: 'error',
					text: error.message || 'Gagal menyimpan data ke database.'
				},
				title,
				image_path
			});
		}
	}
};
