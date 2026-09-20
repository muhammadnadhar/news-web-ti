import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { deleteJabatanProdi, getAllJabatanProdi } from '$lib/repository/admin/dataset/jabatanProdi';

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
			return fail(400, {
				message: { type: 'error', text: 'ID Jabatan tidak valid.' }
			});
		}

		try {
			await deleteJabatanProdi(id);
			return {
				message: { type: 'success', text: 'Berhasil menghapus Jabatan Prodi.' }
			};
		} catch (err: any) {
			return fail(500, {
				message: { type: 'error', text: err.message || 'Gagal menghapus Jabatan Prodi.' }
			});
		}
	}
};
