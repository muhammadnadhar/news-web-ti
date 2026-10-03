import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getScholarshipById,
	updateScholarship
} from '$lib/repository/admin/article/kemahasiswaan/beasiswa';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import type { BeasiswaFormValues } from '$lib/types/values/admin/article';

/**
 * Mengambil data awal beasiswa berdasarkan ID di URL
 */
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID Beasiswa tidak valid');
	}

	const scholarship = await getScholarshipById(id);

	if (!scholarship) {
		throw error(404, 'Data beasiswa tidak ditemukan');
	}

	return {
		scholarship
	};
};

/**
 * FORM ACTIONS
 * Menerima submission form edit dan memanggil updateScholarship
 */
export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();

		const id = params.id || formData.get('id')?.toString().trim() || undefined;

		const values: BeasiswaFormValues = {
			id,
			student_name: formData.get('student_name')?.toString().trim() || '',
			scholarship_name: formData.get('scholarship_name')?.toString().trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || null,
			image_public_id:
				formData.get('image_public_id')?.toString().trim() ||
				formData.get('public_id')?.toString().trim() ||
				null
		};

		if (!values.id) {
			return fail(400, {
				...warningResponse('ID data beasiswa tidak ditemukan.', 'Gagal'),
				values
			});
		}

		if (!values.student_name || !values.scholarship_name) {
			return fail(400, {
				...warningResponse('Nama mahasiswa dan nama beasiswa wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (values.student_name.length > 255 || values.scholarship_name.length > 255) {
			return fail(400, {
				...warningResponse(
					'Nama mahasiswa atau nama beasiswa terlalu panjang (maksimal 255 karakter).',
					'Validasi Gagal'
				),
				values
			});
		}

		try {
			const isUpdated = await updateScholarship(
				values.id,
				values.student_name,
				values.scholarship_name,
				values.image_url,
				values.image_public_id
			);

			if (!isUpdated) {
				return fail(500, {
					...errorResponse('Data beasiswa gagal diperbarui di database.', 'Gagal Memperbarui'),
					values
				});
			}

			return {
				...successResponse('Data beasiswa berhasil diperbarui.', 'Berhasil'),
				values
			};
		} catch (err: any) {
			console.error('Error updateScholarship:', err);
			return fail(500, {
				...errorResponse(
					`Terjadi kesalahan pada server saat memperbarui data: ${err?.message || 'Kesalahan tidak diketahui'}`,
					'Error Sistem'
				),
				values
			});
		}
	},
	// untuk edit dia akan memanggil fungsi delete Photo saat tombol batal di click
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		if (!publicId) {
			return fail(400, { ...errorResponse('Public Id tidak di temukan', 'Error') });
		}

		try {
			await deleteImageFromCloudinary(publicId);
			return successResponse('Berhasil di batalkan', 'Succcess');
		} catch (err) {
			console.error('Error deleting photo:', err);
			return fail(500, errorResponse('Gagal menghapus foto ', 'Gagal'));
		}
	}
} satisfies Actions;
