import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createScholarship } from '$lib/repository/admin/article/kemahasiswaan/beasiswa';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const studentName = formData.get('student_name') as string;
		const scholarshipName = formData.get('scholarship_name') as string;
		const imageUrl = (formData.get('image_url') as string) || null;

		// Validasi input wajib
		if (!studentName || studentName.trim() === '') {
			return fail(400, warningResponse('Nama Mahasiswa wajib diisi.', 'Warnig'));
		}

		if (!imageUrl || imageUrl.trim() === '') {
			return fail(400, warningResponse('Foto Wajib di Isi', 'Image warning'));
		}

		if (!scholarshipName || scholarshipName.trim() === '') {
			return fail(400, warningResponse('Nama Beasiswa wajib di isi', 'Gagal '));
		}

		// Generate UUID unik untuk Primary Key
		const id = randomUUID();

		try {
			const success = await createScholarship(id, studentName, scholarshipName, imageUrl);

			if (!success) {
				return fail(422, errorResponse('Gagal menyimpan data Penerima Beasiswa ke', 'Gagal'));
			}
		} catch (error: any) {
			return fail(500, errorResponse('Terjadi Kesalahan pada System', 'Error'));
		}

		// Redirect ke halaman daftar Beasiswa Kemahasiswaan
		// throw redirect(303, '/admin/kemahasiswaan/beasiswa');
		return successResponse('Berhasil menyimpan data mahasiswa Baru', 'Success');
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
};
