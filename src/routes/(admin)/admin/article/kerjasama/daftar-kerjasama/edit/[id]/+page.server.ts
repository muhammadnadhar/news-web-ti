import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getPartnershipById,
	updatePartnership
} from '$lib/repository/admin/article/kerjasama/daftar';
import { cloudinary } from '$lib/cloudinary/server';
// import { deleteFromCloudinary } from '$lib/cloudinary/server'; // Tambahkan jika ada helper server Cloudinary

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID Kerjasama tidak valid');
	}

	const partnership = await getPartnershipById(id);

	if (!partnership) {
		throw error(404, 'Data Kerjasama tidak ditemukan');
	}

	return {
		kerjasama: partnership
	};
};

export const actions: Actions = {
	// Action untuk memperbarui data Kerjasama (?/update)
	update: async ({ request, params }) => {
		const formData = await request.formData();

		const id = params.id || (formData.get('id') as string);
		const institutionName = (formData.get('institution_name') as string)?.trim();
		const logoUrl = (formData.get('logo_url') as string)?.trim() || null;

		// Validasi Input
		if (!id) {
			return fail(400, {
				status: 'error',
				title: 'Validasi Gagal',
				message: 'ID Kerjasama tidak valid atau tidak ditemukan.'
			});
		}

		if (!institutionName) {
			return fail(400, {
				status: 'error',
				title: 'Validasi Gagal',
				message: 'Nama Instansi / Mitra Kerjasama wajib diisi.',
				values: { institutionName, logoUrl }
			});
		}

		try {
			const success = await updatePartnership(id, institutionName, logoUrl);

			if (!success) {
				return fail(500, {
					status: 'error',
					title: 'Gagal Memperbarui',
					message: 'Data tidak ditemukan atau tidak ada perubahan yang disimpan.',
					values: { institutionName, logoUrl }
				});
			}

			return {
				status: 'success',
				title: 'Berhasil',
				message: 'Data kerjasama berhasil diperbarui.'
			};
		} catch (err) {
			console.error('Error saat update partnership:', err);
			return fail(500, {
				status: 'error',
				title: 'Error Server',
				message: 'Terjadi kesalahan sistem saat memperbarui data.',
				values: { institutionName, logoUrl }
			});
		}
	},

	// Action untuk menghapus foto dari Cloudinary (?/deletePhoto)
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id') as string;

		if (!publicId) {
			return fail(400, {
				status: 'error',
				message: 'Public ID gambar tidak ditemukan.'
			});
		}

		try {
			// Jika Anda memiliki API/Helper server-side untuk Cloudinary:
			// await deleteFromCloudinary(publicId);
			await cloudinary.uploader.destroy(publicId);

			return {
				status: 'success',
				message: 'Gambar berhasil dihapus dari Cloudinary.'
			};
		} catch (err) {
			console.error('Error deleting photo from Cloudinary:', err);
			return fail(500, {
				status: 'error',
				message: 'Gagal menghapus gambar dari server Cloudinary.'
			});
		}
	}
};
