import { getPerminatanTIById, updatePerminatanTI } from '$lib/repository/admin/home/tablePermitan';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const peminatan = await getPerminatanTIById(params.id);

	if (!peminatan) {
		throw error(404, 'Data peminatan tidak ditemukan');
	}

	return { peminatan };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const description = formData.get('description')?.toString().trim();

		if (!title || title.length > 150) {
			return fail(400, {
				success: false,
				status: 'warning' as const,
				title: 'Validasi Gagal',
				message: 'Judul peminatan wajib diisi dan maksimal 150 karakter.'
			});
		}

		if (!description) {
			return fail(400, {
				success: false,
				status: 'warning' as const,
				title: 'Validasi Gagal',
				message: 'Deskripsi peminatan wajib diisi.'
			});
		}

		try {
			const updated = await updatePerminatanTI(params.id, { title, description });

			if (!updated) {
				return fail(400, {
					success: false,
					status: 'error' as const,
					title: 'Gagal Memperbarui',
					message: 'Data tidak ditemukan atau tidak ada perubahan yang disimpan.'
				});
			}

			return {
				success: true,
				status: 'success' as const,
				title: 'Berhasil Diperbarui!',
				message: 'Data peminatan TI berhasil diperbarui.'
			};
		} catch (err) {
			console.error('Error in updatePerminatanTI:', err);
			return fail(500, {
				success: false,
				status: 'error' as const,
				title: 'Terjadi Kesalahan',
				message: 'Gagal memperbarui data peminatan ke database.'
			});
		}
	}
};
