import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	getScholarshipById,
	updateScholarship
} from '$lib/repository/admin/article/kemahasiswaan/beasiswa';

/**
 * 1. LOAD FUNCTION
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
 * 2. FORM ACTIONS
 * Menerima submission form edit dan memanggil updateScholarship
 */
export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();

		// Ambil ID dari params URL atau hidden field
		const id = params.id || (formData.get('id') as string);
		const studentName = (formData.get('student_name') as string)?.trim();
		const scholarshipName = (formData.get('scholarship_name') as string)?.trim();
		const imageUrl = (formData.get('image_url') as string)?.trim() || '';

		// Simpan nilai input untuk dikembalikan jika validasi gagal
		const values = {
			student_name: studentName,
			scholarship_name: scholarshipName,
			image_url: imageUrl
		};

		// Validasi dasar di server
		if (!studentName || !scholarshipName) {
			return fail(400, {
				success: false,
				title: 'Validasi Gagal',
				message: 'Nama mahasiswa dan nama beasiswa wajib diisi.',
				values
			});
		}

		try {
			// Panggil method repository
			const isUpdated = await updateScholarship(id, studentName, scholarshipName, imageUrl);

			if (!isUpdated) {
				return fail(500, {
					success: false,
					title: 'Gagal Memperbarui',
					message: 'Data beasiswa gagal diperbarui di database.',
					values
				});
			}

			return {
				success: true,
				title: 'Berhasil',
				message: 'Data beasiswa berhasil diperbarui.'
			};
		} catch (err) {
			console.error('Error updateScholarship:', err);
			return fail(500, {
				success: false,
				title: 'Error Sistem',
				message: 'Terjadi kesalahan pada server saat memperbarui data.',
				values
			});
		}
	}
} satisfies Actions;
