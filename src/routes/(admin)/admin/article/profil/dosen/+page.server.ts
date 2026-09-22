import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	deleteLecturerStaff,
	getAllLecturerStaff,
	createLecturerStaff,
	updateLecturerStaff
} from '$lib/repository/admin/article/profile/dosen&staff';
import { errorResponse, successResponse } from '$lib/helper/message';
export const load: PageServerLoad = async () => {
	try {
		// const lecturerStaffList = await getAllLecturerStaff();
		return {
			lecturerStaffList: getAllLecturerStaff() // promise streaming
		};
	} catch (err) {
		console.error('Error loading lecturer & staff list:', err);
		throw error(500, 'Gagal mengambil data Dosen & Staff dari server.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const name = formData.get('name') as string;
		const nidn = formData.get('nidn') as string;
		const expertise = formData.get('expertise') as string;

		if (!name || !expertise) {
			return fail(400, { missingFields: true, message: 'Nama dan Bidang wajib diisi.' });
		}

		try {
			if (isEdit) {
				await updateLecturerStaff(id, { name, nidn, expertise });
			} else {
				await createLecturerStaff(id, { name, nidn, expertise, photo_url: null });
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving lecturer/staff:', err);
			return fail(500, { message: 'Gagal menyimpan data.' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		// 1. Validasi ID
		if (!id) {
			return fail(400, errorResponse('ID tidak valid.', 'Gagal'));
		}

		try {
			await deleteLecturerStaff(id);

			// Success Response
			return successResponse('Data Dosen/Staf berhasil dihapus.', 'Berhasil');
		} catch (err) {
			console.error('Error deleting lecturer/staff:', err);

			// 3. Error Response Sistem
			return fail(500, errorResponse('Gagal menghapus data.', 'Kesalahan Sistem'));
		}
	}
};
