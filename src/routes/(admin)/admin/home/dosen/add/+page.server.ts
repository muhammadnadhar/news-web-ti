import { fail, redirect, type Actions } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import type { PageServerLoad } from './$types';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';
import { getJabatanProdiList } from '$lib/repository/admin/dataset/jabatanProdi';
import { createDosenPrimary } from '$lib/repository/admin/home/dosenPrimary';
import { successResponse, warningResponse } from '$lib/helper/message';
import type { DosenPrimaryFormValue } from '$lib/types/values/admin/home';

export const load: PageServerLoad = async () => {
	try {
		const [lecturers, positions] = await Promise.all([
			getAllLecturerStaff(),
			getJabatanProdiList()
		]);

		return {
			lecturers,
			positions
		};
	} catch (err: any) {
		console.error('Error loading data for Dosen Primary:', err);
		return {
			lecturers: [],
			positions: []
		};
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const values: DosenPrimaryFormValue = {
			lecturerStaffId: formData.get('lecturer_staff_id')?.toString().trim() || '',
			position: formData.get('position')?.toString().trim() || ''
		};

		if (!values.lecturerStaffId || !values.position) {
			return fail(400, {
				...warningResponse('Harap pilih Dose/Staff dan jabatan Prodi', 'Erorr'),
				values
			});
		}

		const id = randomUUID();

		try {
			await createDosenPrimary(id, {
				lecturer_staff_id: values.lecturerStaffId,
				position: values.position
			});
		} catch (err: any) {
			console.error('Error creating Dosen Primary:', err);
			return fail(500, {
				message: {
					type: 'error',
					text: err.message || 'Gagal menyimpan data Dosen Primary ke database.'
				},
				values
			});
		}

		return {
			message: {
				type: 'success',
				...successResponse('Berhasil menambahkan Dosen Primary baru!', 'Success'),
				values
			}
		};
	}
};
