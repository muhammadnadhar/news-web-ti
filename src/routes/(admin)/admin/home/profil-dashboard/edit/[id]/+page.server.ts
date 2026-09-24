import { fail, error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	deleteProfileDashboard,
	getProfileDashboardById,
	updateProfileDashboard
} from '$lib/repository/admin/home/profileDashboard';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	if (!id) {
		throw error(400, 'ID Profile Dashboard tidak valid.');
	}

	const profile = await getProfileDashboardById(id);

	if (!profile) {
		throw error(404, 'Data Profile Dashboard tidak ditemukan.');
	}

	return {
		profile
	};
};

export const actions: Actions = {
	// Action untuk Update Data
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const title = (formData.get('title') as string)?.trim();
		const imagePath = (formData.get('image_path') as string)?.trim();

		if (!title || !imagePath) {
			return fail(400, {
				message: { type: 'error', text: 'Profile text dan gambar wajib diisi.' },
				title,
				imagePath
			});
		}

		try {
			const isUpdated = await updateProfileDashboard(params.id, {
				title,
				image_path: imagePath
			});

			if (!isUpdated) {
				return fail(500, {
					message: { type: 'error', text: 'Gagal memperbarui data di database.' }
				});
			}

			return {
				message: { type: 'success', text: 'Profile Dashboard berhasil diperbarui!' }
			};
		} catch (err: any) {
			return fail(500, {
				message: { type: 'error', text: err?.message || 'Terjadi kesalahan sistem.' }
			});
		}
	},

	// Action untuk Hapus Data
	delete: async ({ params }) => {
		try {
			const isDeleted = await deleteProfileDashboard(params.id);

			if (!isDeleted) {
				return fail(500, {
					message: { type: 'error', text: 'Gagal menghapus data dari database.' }
				});
			}
		} catch (err: any) {
			return fail(500, {
				message: { type: 'error', text: err?.message || 'Terjadi kesalahan saat menghapus data.' }
			});
		}

		// Redirect kembali ke halaman utama setelah berhasil hapus
		throw redirect(303, '/admin/profile-dashboard');
	}
};
