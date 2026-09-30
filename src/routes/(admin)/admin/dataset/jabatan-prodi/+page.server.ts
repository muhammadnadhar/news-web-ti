import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { deleteJabatanProdi, getAllJabatanProdi } from '$lib/repository/admin/dataset/jabatanProdi';
import { successResponse, warningResponse } from '$lib/helper/message';

export const load: PageServerLoad = async () => {
	try {
		const positions = getAllJabatanProdi(); // lazyload
		return { positions };
	} catch (err: any) {
		console.error('Error load Jabatan Prodi:', err);
		return { positions: [] };
	}
};

export const actions: Actions = {
	// Hapus Jabatan
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString().trim();

		if (!id) {
			return fail(400, warningResponse('Id Jabatan tidak valid ', 'error'));
		}

		try {
			await deleteJabatanProdi(id);
			return successResponse('Berhasil menghapus Jabatan tersebut', 'Success');
		} catch (err: any) {
			return fail(500, {
				message: { type: 'error', text: err.message || 'Gagal menghapus Jabatan Prodi.' }
			});
		}
	}
};
