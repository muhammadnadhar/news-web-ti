import { deleteDosenPrimary, getPrimaryDosenList } from '$lib/repository/admin/home/dosenPrimary';
import {
	deleteProfileDashboard,
	getAllProfileDashboards,
	getPublicIdProfileDashboardById
} from '$lib/repository/admin/home/profileDashboard';
import {
	deleteProfilProdi,
	getAllProfilProdi,
	getPublicIdProfilProdiById
} from '$lib/repository/admin/home/profilProdi';
import { deletePerminatanTI, getAllPerminatanTI } from '$lib/repository/admin/home/tablePermitan';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
export const load: PageServerLoad = async () => {
	// const [primaryDosenList, listPerminatan, listProfil, listProfileDashboard] = await Promise.all([
	// 	getPrimaryDosenList(),
	// 	getAllPerminatanTI(),
	// 	getAllProfilProdi(),
	// 	getAllProfileDashboards()
	// ]);
	console.table(await getAllProfileDashboards());
	return {
		// primaryDosenList,
		// listPerminatan,
		// listProfil,
		// listProfileDashboard

		// Mengembalikan Promise langsung tanpa await untuk di-stream ke client
		primaryDosenList: getPrimaryDosenList(),
		listPerminatan: getAllPerminatanTI(),
		listProfil: getAllProfilProdi(),
		listProfileDashboard: getAllProfileDashboards()
	};
};

export const actions: Actions = {
	deleteProfileDashboard: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString().trim();

		if (!id) {
			return fail(400, warningResponse('ID tidak valid.', 'Gagal'));
		}

		try {
			//Ambil image_public_id terlebih dahulu
			const imagePublicId = await getPublicIdProfileDashboardById(id);

			//  Jika ada berkas gambar di Cloudinary, hapus aset terlebih dahulu
			if (imagePublicId) {
				await deleteImageFromCloudinary(imagePublicId);
			}

			const success = await deleteProfileDashboard(id);

			if (!success) {
				return fail(404, warningResponse('Data tidak ditemukan atau gagal dihapus.', 'Gagal'));
			}

			return successResponse(
				'Data Profile Dashboard dan berkas gambar terkait berhasil dihapus.',
				'Berhasil'
			);
		} catch (error: any) {
			console.error('Error deleteProfileDashboard:', error);

			// Response Error Sistem
			return fail(
				500,
				errorResponse(
					'Terjadi kesalahan sistem saat menghapus data Profile Dashboard.',
					'Kesalahan Sistem'
				)
			);
		}
	},
	deleteDosenPrimary: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { success: false, message: 'ID tidak valid' });
		}

		try {
			// karena cuman data forengkey jadi  image akan di simpan di primary table dosen & staff
			const success = await deleteDosenPrimary(id);
			if (!success) {
				return fail(404, { success: false, message: 'Data tidak ditemukan atau gagal dihapus' });
			}

			return { success: true, message: 'Dosen primary berhasil dihapus' };
		} catch (error) {
			console.error('Error deleteDosenPrimary:', error);
			return fail(500, { success: false, message: 'Terjadi kesalahan server' });
		}
	},
	deletePerminatanTI: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { success: false, message: 'ID tidak valid' });
		}

		try {
			const success = await deletePerminatanTI(id);
			if (!success) {
				return fail(404, { success: false, message: 'Data tidak ditemukan atau gagal dihapus' });
			}

			return { success: true, message: 'Data perminatan TI berhasil dihapus' };
		} catch (error) {
			console.error('Error deletePerminatanTI:', error);
			return fail(500, { success: false, message: 'Terjadi kesalahan server' });
		}
	},

	deleteProfileProdiItem: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString().trim();

		if (!id) {
			return fail(400, warningResponse('ID Profil Prodi tidak valid.', 'Gagal'));
		}

		try {
			//  Ambil image_public_id terlebih dahulu secara efisien
			const imagePublicId = await getPublicIdProfilProdiById(id);

			//Jika ada berkas gambar di Cloudinary, lakukan pembersihan
			if (imagePublicId) {
				await deleteImageFromCloudinary(imagePublicId);
			}

			const success = await deleteProfilProdi(id);

			if (!success) {
				return fail(
					404,
					warningResponse('Data Profil Prodi tidak ditemukan atau gagal dihapus.', 'Gagal')
				);
			}

			return successResponse(
				'Data Profil Prodi dan berkas gambar terkait berhasil dihapus.',
				'Berhasil'
			);
		} catch (error: any) {
			console.error('Error deleteProfileProdiItem:', error);

			return fail(
				500,
				errorResponse(
					'Terjadi kesalahan sistem saat menghapus data Profil Prodi.',
					'Kesalahan Sistem'
				)
			);
		}
	}
};
