import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getLecturerPublicationById,
	updateLecturerPublication
} from '$lib/server/admin/repository/article/penelitian/publikasiDosen';
import { errorResponse, successResponse } from '$lib/helper/message';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		let lecture = await getLecturerPublicationById(id);

		return {
			lecturerPublication: lecture
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

		const lecturer_name = (formData.get('lecturer_name') as string)?.trim();
		const sinta_link = (formData.get('sinta_link') as string)?.trim() || null;
		const scholar_link = (formData.get('scholar_link') as string)?.trim() || null;

		if (!lecturer_name) {
			return fail(400, {
				...errorResponse('Nama dosen wajib diisi.', 'Validasi Gagal'),
				values: { lecturer_name, sinta_link, scholar_link }
			});
		}

		try {
			await updateLecturerPublication(id, lecturer_name, sinta_link, scholar_link);

			return successResponse('Data publikasi dosen berhasil diperbarui.');
		} catch (err: any) {
			console.error('Error updating lecturer publication:', err);
			return fail(500, {
				...errorResponse('Gagal memperbarui data publikasi dosen.'),
				values: { lecturer_name, sinta_link, scholar_link }
			});
		}
	}
};
