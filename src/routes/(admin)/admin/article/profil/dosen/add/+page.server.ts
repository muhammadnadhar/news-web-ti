import { cloudinary } from '$lib/cloudinary/server';
import { randomUUID } from '$lib/crypto';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { createLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';
import type { LecturerStaffFormValues } from '$lib/types/values/admin/article';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const values: LecturerStaffFormValues = {
			name: formData.get('name')?.toString().trim() || '',
			nidn: formData.get('nidn')?.toString().trim() || null,
			expertise: formData.get('expertise')?.toString().trim() || '',
			pddikti_url: formData.get('pddikti_url')?.toString().trim() || null,
			category: formData.get('category')?.toString().trim() || 'dosen',
			photo_url: formData.get('photo_url')?.toString().trim() || null,
			photo_public_id:
				formData.get('photo_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null
		};

		// Validasi Field Wajib
		if (!values.name || !values.expertise) {
			return fail(400, {
				...warningResponse('Harap isi Nama Lengkap dan Bidang Keahlian / Tugas.', 'Validasi Gagal'),
				values
			});
		}

		const id = crypto.randomUUID(); // Standarisasi penggunaan crypto.randomUUID()
		const role = values.category;

		try {
			await createLecturerStaff(id, {
				name: values.name,
				nidn: values.nidn,
				expertise: values.expertise,
				pddikti_url: values.pddikti_url,
				photo_url: values.photo_url,
				role: role,
				photo_public_id: values.photo_public_id
			});
		} catch (err: any) {
			console.error('Error creating lecturer/staff:', err);

			// Rollback: Hapus foto dari Cloudinary jika simpan ke DB Gagal
			if (values.photo_public_id) {
				try {
					await deleteImageFromCloudinary(values.photo_public_id);
				} catch (cleanupErr) {
					console.error('Gagal melakukan cleanup Cloudinary:', cleanupErr);
				}
			}

			return fail(500, {
				...errorResponse(
					err?.message || 'Gagal menyimpan data Dosen/Staff ke database.',
					'Kesalahan Sistem'
				),
				values
			});
		}

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
			const result = await deleteImageFromCloudinary(publicId);
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
