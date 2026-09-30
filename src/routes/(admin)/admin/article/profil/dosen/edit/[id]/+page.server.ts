import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getLecturerStaffById,
	getPhotoPublicIdLecturerStaffById,
	updateLecturerStaff
} from '$lib/repository/admin/article/profile/dosen&staff';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

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

		const id = (formData.get('id') as string) || params.id;
		const name = formData.get('name') as string;
		const nidn = formData.get('nidn') as string;
		const expertise = formData.get('expertise') as string;
		const pddikti_url = formData.get('pddikti_url') as string;
		const category = formData.get('category') as string;
		const photo_url = formData.get('photo_url') as string;
		const public_id = formData.get('public_id') as string;

		// Validasi Field Wajib
		if (!id || !name || !expertise) {
			return fail(400, {
				status: 'error',
				title: 'Gagal Menyimpan',
				message: 'Nama Lengkap dan Bidang Keahlian wajib diisi.'
			});
		}

		// Format role dari input kategori ('dosen' -> 'Dosen', 'staff' -> 'Staff')
		const role = category === 'staff' ? 'Staff' : 'Dosen';
		const newPhotoUrl = photo_url ? photo_url.trim() : null;
		const newPublicId = public_id ? public_id.trim() : null;

		try {
			//  Ambil public_id foto lama dari database
			const oldPhotoPublicId = await getPhotoPublicIdLecturerStaffById(id);

			// Hapus foto lama di Cloudinary jika ada DAN berbeda dari public_id baru (diganti/dihapus)
			if (oldPhotoPublicId && oldPhotoPublicId !== newPublicId) {
				try {
					await deleteImageFromCloudinary(oldPhotoPublicId);
				} catch (cloudinaryErr) {
					console.error('Gagal menghapus foto lama dari Cloudinary:', cloudinaryErr);
					// Lanjutkan eksekusi agar update database tetap berjalan meskipun hapus Cloudinary gagal
				}
			}

			//  Update data di database
			const isUpdated = await updateLecturerStaff(id, {
				name: name.trim(),
				nidn: nidn ? nidn.trim() : null,
				pddikti_url: pddikti_url ? pddikti_url.trim() : null,
				expertise: expertise.trim(),
				role: role,
				is_primary: false,
				photo_url: newPhotoUrl,
				photo_public_id: newPublicId
			});

			if (!isUpdated) {
				return fail(500, {
					status: 'error',
					title: 'Gagal Memperbarui',
					message: 'Data tidak ditemukan atau tidak ada perubahan data.'
				});
			}

			return {
				status: 'success',
				title: 'Berhasil',
				message: 'Data Dosen/Staff berhasil diperbarui!'
			};
		} catch (err) {
			console.error('Error update LecturerStaff:', err);
			return fail(500, {
				status: 'error',
				title: 'Error Sistem',
				message: 'Terjadi kesalahan pada server saat memperbarui data.'
			});
		}
	},
	// Action untuk Membatalkan / Menghapus Foto dari Cloudinary
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString().trim();

		console.info('id dapat : ', publicId);

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
