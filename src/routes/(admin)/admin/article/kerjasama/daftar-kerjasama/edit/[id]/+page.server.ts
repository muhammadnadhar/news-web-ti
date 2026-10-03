import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getPartnershipById,
	updatePartnership
} from '$lib/repository/admin/article/kerjasama/daftar';
import { cloudinary } from '$lib/cloudinary/server';
import type { KerjasamaFormValues } from '$lib/types/values/admin/article';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
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
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const id = params.id || (formData.get('id') as string);

		const values: KerjasamaFormValues = {
			id,
			institution_name: (formData.get('institution_name') as string)?.trim() || '',
			logo_url: (formData.get('logo_url') as string)?.trim() || null,
			public_id:
				(formData.get('logo_public_id') as string)?.trim() ||
				(formData.get('public_id') as string)?.trim() ||
				null
		};
		if (!values.id) {
			return fail(400, {
				...errorResponse('ID Kerjasama tidak valid atau tidak ditemukan.', 'Validasi Gagal')
			});
		}

		if (!values.institution_name) {
			return fail(400, {
				...warningResponse('Nama Instansi / Mitra Kerjasama wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const success = await updatePartnership(
				values.id,
				values.institution_name,
				values.logo_url,
				values.logo_public_id
			);

			if (!success) {
				return fail(500, {
					...errorResponse(
						'Data tidak ditemukan atau tidak ada perubahan yang disimpan.',
						'Gagal Memperbarui'
					),
					values
				});
			}

			return successResponse('Data kerjasama berhasil diperbarui.', 'Berhasil');
		} catch (err) {
			console.error('Error saat update partnership:', err);
			return fail(500, {
				...errorResponse('Terjadi kesalahan sistem saat memperbarui data.', 'Error Server'),
				values
			});
		}
	},

	// Action untuk menghapus foto dari Cloudinary (?/deletePhoto)
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id') as string;

		if (!publicId) {
			return fail(400, {
				...errorResponse('Public ID gambar tidak ditemukan.', 'Validasi Gagal')
			});
		}

		try {
			await deleteImageFromCloudinary(publicId);

			return successResponse('Gambar berhasil dihapus dari Cloudinary.', 'Berhasil');
		} catch (err) {
			console.error('Error deleting photo from Cloudinary:', err);
			return fail(500, {
				...errorResponse('Gagal menghapus gambar dari server Cloudinary.', 'Error Server')
			});
		}
	}
};
