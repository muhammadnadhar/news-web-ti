import { cloudinary } from '$lib/cloudinary/server';
import { randomUUID } from '$lib/crypto';
import { errorResponse, successResponse } from '$lib/helper/message';
import { createLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	// Action untuk Menyimpan Data Dosen / Staff
	create: async ({ request }) => {
		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const nidn = formData.get('nidn')?.toString().trim() || null;
		const expertise = formData.get('expertise')?.toString().trim();
		const pddiktiUrl = formData.get('pddikti_url')?.toString().trim() || null;
		const category = formData.get('category')?.toString().trim();

		// Mengambil foto_url & public_id yang sudah dihandle oleh CldUploadWidget dari client
		const photoUrl = formData.get('photo_url')?.toString().trim() || null;
		const publicId = formData.get('public_id')?.toString().trim() || null;

		if (!name || !expertise) {
			return fail(400, {
				...errorResponse('Harap isi Nama Lengkap dan Bidang Keahlian / Tugas.', 'Validasi Gagal'),
				values: { name, nidn, expertise, pddiktiUrl, category, photoUrl, publicId }
			});
		}

		const id = randomUUID();

		try {
			await createLecturerStaff(id, {
				name,
				nidn,
				expertise,
				pddikti_url: pddiktiUrl,
				photo_url: photoUrl,
				role: category
			});
		} catch (err: any) {
			console.error('Error creating lecturer/staff:', err);

			// Rollback: Hapus foto dari Cloudinary jika simpan DB Gagal
			if (publicId) {
				try {
					await cloudinary.uploader.destroy(publicId);
					return successResponse('Berhasil memberhasihkan foto ', 'Rolback');
				} catch (cleanupErr) {
					console.error('Gagal melakukan cleanup Cloudinary:', cleanupErr);
				}
			}

			// Menggunakan helper errorResponse dan menyertakan values
			return fail(500, {
				...errorResponse(
					err.message || 'Gagal menyimpan data Dosen/Staff ke database.',
					'Kesalahan Sistem'
				),
				values: { name, nidn, expertise, pddiktiUrl, category, photoUrl, publicId }
			});
		}

		// Menggunakan helper successResponse untuk hasil sukses
		return successResponse('Berhasil menambahkan data Dosen/Staff baru!', 'Berhasil');
	},

	// Action untuk Membatalkan / Menghapus Foto dari Cloudinary
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString().trim();

		if (!publicId) {
			return fail(400, {
				deleteError: 'Public ID tidak ditemukan.'
			});
		}

		try {
			const result = await cloudinary.uploader.destroy(publicId);
			return {
				deleteSuccess: true,
				result
			};
		} catch (err: any) {
			console.error('Error deleting photo from Cloudinary:', err);
			return fail(500, {
				deleteError: err.message || 'Gagal menghapus foto dari Cloudinary.'
			});
		}
	}
};
