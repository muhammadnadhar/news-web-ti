import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getDosenWellcome,
	upsertDosenWellcome
} from '$lib/repository/admin/home/dosenWellcomeKaprodi';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';
import { successResponse, warningResponse } from '$lib/helper/message';

export const load: PageServerLoad = async () => {
	const sambutan = await getDosenWellcome(); // alngsung ambil aja ini yg paling 1 p
	const staffList = await getAllLecturerStaff();

	return {
		sambutan,
		staffList
	};
};
export const actions: Actions = {
	saveWellcome: async ({ request }) => {
		const formData = await request.formData();
		const lecturer_staff_id = formData.get('lecturer_staff_id')?.toString();
		const title = formData.get('title')?.toString();
		const welcome_message: string | undefined = formData.get('welcome_message')?.toString();

		if (!lecturer_staff_id || !title || !welcome_message) {
			return fail(400, {
				...warningResponse('Semua kolom wajib di Isi', 'Validasi gagal ')
			});
		}

		try {
			await upsertDosenWellcome({
				lecturer_staff_id,
				title,
				welcome_message
			});

			return {
				...successResponse('Data Sambutan kaprodi berhasil di simpan'),
				success: true
			};
		} catch (error) {
			console.error(error);
			return fail(500, {
				message: {
					status: 'error',
					title: 'Kesalahan Server',
					text: 'Gagal menyimpan ke database.'
				}
			});
		}
	}
};
