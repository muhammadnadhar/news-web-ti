import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getLecturerStaffById,
	getLecturerStaffByRole
} from '$lib/repository/admin/article/profile/dosen&staff';
import {
	getPrimaryDosenList,
	updatePrimaryDosenSlot
} from '$lib/repository/admin/home/dosenPrimary';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const dosen = await getLecturerStaffById(id);
	//Ambil daftar semua dosen untuk pilihan dropdown
	const allDosen = await getLecturerStaffByRole('Dosen');

	//  Ambil data 3 slot primary beserta detail dosennya
	const primaryDosenList = await getPrimaryDosenList();

	if (!dosen || dosen.role !== 'Dosen') {
		throw error(404, 'Data dosen tidak ditemukan');
	}

	return {
		allDosen,
		primaryDosenList
	};
};

export const actions: Actions = {
	updateSlot: async ({ request }) => {
		const formData = await request.formData();
		const primaryId = formData.get('primary_id') as string;
		const lecturerStaffId = formData.get('lecturer_staff_id') as string;
		const position = formData.get('position') as string;

		if (!primaryId || !lecturerStaffId) {
			return fail(400, { message: 'Data tidak lengkap.' });
		}

		const success = await updatePrimaryDosenSlot(primaryId, lecturerStaffId, position);

		if (!success) {
			return fail(500, { message: 'Gagal mengubah dosen pilihan.' });
		}

		return { success: true, message: 'Dosen primary berhasil diperbarui!' };
	}

	// Action khusus untuk mengubah status is_primary
	// 	togglePrimary: async ({ params, request }) => {
	// 		const formData = await request.formData();
	// 		const isPrimary = formData.get('is_primary') === 'true';
	//
	// 		const dosen = await getLecturerStaffById(params.id);
	// 		if (!dosen) {
	// 			return fail(404, { message: 'Data dosen tidak ditemukan' });
	// 		}
	//
	// 		const success = await updateLecturerStaff(params.id, {
	// 			...dosen,
	// 			is_primary: isPrimary
	// 		});
	//
	// 		if (!success) {
	// 			return fail(500, { message: 'Gagal memperbarui status tampilan Home' });
	// 		}
	//
	// 		return {
	// 			success: true,
	// 			message: isPrimary
	// 				? 'Dosen berhasil ditandai sebagai data utama di Home'
	// 				: 'Dosen diubah menjadi data reguler'
	// 		};
	// 	}
};
