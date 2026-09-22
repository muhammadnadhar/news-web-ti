import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse } from '$lib/helper/message';
import { createLecturerPublication } from '$lib/repository/admin/article/penelitian/publikasiDosen';
import { randomUUID } from '$lib/crypto';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';

export const load: PageServerLoad = async ({ params }) => {
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
		const lecturer_id = (formData.get('lecturer_id') as string)?.trim();
		const sinta_link = (formData.get('sinta_link') as string)?.trim() || null;
		const scholar_link = (formData.get('scholar_link') as string)?.trim() || null;

		// Validasi field wajib
		if (!lecturer_id) {
			return fail(400, {
				...errorResponse('Nama dosen wajib diisi.', 'Validasi Gagal'),
				values: { lecturer_id, sinta_link, scholar_link }
			});
		}

		try {
			const id = randomUUID(); // Buat UUID v4

			createLecturerPublication(id, lecturer_id, sinta_link, scholar_link);
			return successResponse('Data publikasi dosen berhasil ditambahkan.');
		} catch (err: any) {
			console.error('Error adding lecturer publication:', err);
			return fail(500, {
				...errorResponse('Gagal menyimpan data publikasi dosen.'),
				values: { lecturer_id, sinta_link, scholar_link }
			});
		}
	}
};
