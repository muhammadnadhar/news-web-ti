import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getPrimaryDosenById,
	updatePrimaryDosenSlot
} from '$lib/repository/admin/home/dosenPrimary';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';
import { getJabatanProdiList } from '$lib/repository/admin/dataset/jabatanProdi';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		error(400, 'ID Dosen Primary tidak valid.');
	}

	// Load data slot yang diedit bersama daftar dosen & daftar jabatan secara paralel
	const [primaryData, lecturers, positions] = await Promise.all([
		getPrimaryDosenById(id),
		getAllLecturerStaff(),
		getJabatanProdiList()
	]);

	if (!primaryData) {
		error(404, 'Data Dosen Primary tidak ditemukan.');
	}

	return {
		primaryLecturer: {
			id: primaryData.primary_id,
			lecturerStaffId: primaryData.lecturer_staff_id,
			position: primaryData.position
		},
		lecturers,
		positions
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || params.id;
		const lecturerStaffId = formData.get('lecturer_staff_id') as string;
		const position = formData.get('position') as string;

		if (!id || !lecturerStaffId || !position) {
			return fail(400, {
				message: 'Dosen dan Jabatan wajib dipilih.',
				values: { lecturerStaffId, position }
			});
		}

		try {
			const success = await updatePrimaryDosenSlot(id, lecturerStaffId, position);

			if (!success) {
				return fail(500, {
					message: 'Gagal memperbarui data Dosen Primary.',
					values: { lecturerStaffId, position }
				});
			}

			return {
				success: true,
				message: 'Data Dosen Primary berhasil diperbarui!'
			};
		} catch (err) {
			console.error('Error updating Dosen Primary:', err);
			return fail(500, {
				message: 'Terjadi kesalahan sistem saat memperbarui data.',
				values: { lecturerStaffId, position }
			});
		}
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
