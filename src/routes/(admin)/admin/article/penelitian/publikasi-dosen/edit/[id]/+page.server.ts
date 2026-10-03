import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import {
	getLecturerPublicationById,
	updateLecturerPublication
} from '$lib/repository/admin/article/penelitian/publikasiDosen';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';
import type { LecturerPublicationFormValues } from '$lib/types/values/admin/article';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		let lecture = await getLecturerPublicationById(id);
		const lecturers = await getAllLecturerStaff();

		return {
			lecturerPublication: lecture,
			lecturers: lecturers
		};
	} catch (err: any) {
		if (err.status === 404) throw err;
		console.error('Error fetching lecturer publication:', err);
		throw error(500, 'Gagal mengambil data publikasi dosen.');
	}
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		const values: LecturerPublicationFormValues = {
			id,
			lecturer_id: (formData.get('lecturer_id') as string)?.trim() || '',
			sinta_link: (formData.get('sinta_link') as string)?.trim() || null,
			scholar_link: (formData.get('scholar_link') as string)?.trim() || null
		};

		if (!values.lecturer_id) {
			return fail(400, {
				...warningResponse('Silakan pilih dosen terlebih dahulu.', 'Validasi Gagal'),
				values
			});
		}

		try {
			await updateLecturerPublication(
				id!,
				values.lecturer_id,
				values.sinta_link,
				values.scholar_link
			);

			return successResponse('Data publikasi dosen berhasil diperbarui.', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating lecturer publication:', err);
			return fail(500, {
				...errorResponse('Gagal memperbarui data publikasi dosen.', 'Kesalahan Server'),
				values
			});
		}
	}
};
