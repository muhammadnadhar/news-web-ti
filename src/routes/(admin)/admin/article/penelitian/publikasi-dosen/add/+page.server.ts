import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { createLecturerPublication } from '$lib/repository/admin/article/penelitian/publikasiDosen';
import { randomUUID } from '$lib/crypto';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';
import type { LecturerPublicationFormValues } from '$lib/types/values/admin/article';

export const load: PageServerLoad = async () => {
	try {
		// Ambil seluruh data Dosen untuk di-pass ke option <select>
		const lecturers = await getAllLecturerStaff();
		return {
			lecturers
		};
	} catch (err) {
		console.error('Error loading data:', err);
		return {
			lecturers: [],
			initialData: null
		};
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const values: LecturerPublicationFormValues = {
			lecturer_id: (formData.get('lecturer_id') as string)?.trim() || '',
			sinta_link: (formData.get('sinta_link') as string)?.trim() || null,
			scholar_link: (formData.get('scholar_link') as string)?.trim() || null
		};

		if (!values.lecturer_id) {
			return fail(400, {
				...warningResponse('Nama dosen wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const id = randomUUID();

			await createLecturerPublication(
				id,
				values.lecturer_id,
				values.sinta_link,
				values.scholar_link
			);

			return successResponse('Data publikasi dosen berhasil ditambahkan.', 'Berhasil');
		} catch (err: any) {
			console.error('Error adding lecturer publication:', err);

			return fail(500, {
				...errorResponse('Gagal menyimpan data publikasi dosen.', 'Kesalahan Server'),
				values
			});
		}
	}
};
