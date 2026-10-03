import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getLecturerStaffById,
	getPhotoPublicIdLecturerStaffById,
	updateLecturerStaff
} from '$lib/repository/admin/article/profile/dosen&staff';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import type { LecturerStaffFormValues } from '$lib/types/values/admin/article';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	if (!id) {
		throw error(400, 'ID tidak valid');
	}

	const item = await getLecturerStaffById(id);

	if (!item) {
		throw error(404, 'Data Dosen/Staff tidak ditemukan');
	}

	// Mapping DTO Database ke Props InitialData Komponen
	return {
		initialData: {
			id: item.id,
			name: item.name,
			nidn: item.nidn ?? '',
			expertise: item.expertise,
			pddiktiUrl: item.pddikti_url ?? '',
			photoUrl: item.photo_url ?? '',
			publicId: item.photo_public_id ?? '',
			category: item.role ? item.role.toLowerCase() : 'dosen'
		}
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();

		const values: LecturerStaffFormValues = {
			id: (formData.get('id') as string)?.trim() || params.id,
			name: (formData.get('name') as string)?.trim() || '',
			nidn: (formData.get('nidn') as string)?.trim() || null,
			expertise: (formData.get('expertise') as string)?.trim() || '',
			pddikti_url: (formData.get('pddikti_url') as string)?.trim() || null,
			category: (formData.get('category') as string)?.trim() || 'Dosen',
			photo_url: (formData.get('photo_url') as string)?.trim() || null,
			photo_public_id:
				(formData.get('photo_public_id') as string)?.trim() ||
				(formData.get('public_id') as string)?.trim() ||
				null
		};

		if (!values.id) {
			return fail(400, {
				...errorResponse('ID Dosen/Staff tidak ditemukan.', 'Validasi Gagal')
			});
		}

		if (!values.name || !values.expertise) {
			return fail(400, {
				...warningResponse('Nama Lengkap dan Bidang Keahlian wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		// Format role dari input kategori ('staff' -> 'Staff', default -> 'Dosen')
		const role = values.category === 'staff' ? 'Staff' : 'Dosen';

		try {
			// Ambil public_id foto lama dari database
			const oldPhotoPublicId = await getPhotoPublicIdLecturerStaffById(values.id);

			// Hapus foto lama di Cloudinary jika ada DAN berbeda dari public_id baru
			if (oldPhotoPublicId && oldPhotoPublicId !== values.photo_public_id) {
				try {
					await deleteImageFromCloudinary(oldPhotoPublicId);
				} catch (cloudinaryErr) {
					console.error('Gagal menghapus foto lama dari Cloudinary:', cloudinaryErr);
				}
			}

			// Update data di database
			const isUpdated = await updateLecturerStaff(values.id, {
				name: values.name,
				nidn: values.nidn,
				pddikti_url: values.pddikti_url,
				expertise: values.expertise,
				role: role,
				is_primary: false,
				photo_url: values.photo_url,
				photo_public_id: values.photo_public_id
			});

			if (!isUpdated) {
				return fail(400, {
					...errorResponse(
						'Data tidak ditemukan atau tidak ada perubahan data.',
						'Gagal Memperbarui'
					),
					values
				});
			}

			return successResponse('Data Dosen/Staff berhasil diperbarui!', 'Berhasil');
		} catch (err: any) {
			console.error('Error update LecturerStaff:', err);
			return fail(500, {
				...errorResponse(
					'Terjadi kesalahan pada server saat memperbarui data.',
					'Kesalahan Server'
				),
				values
			});
		}
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
