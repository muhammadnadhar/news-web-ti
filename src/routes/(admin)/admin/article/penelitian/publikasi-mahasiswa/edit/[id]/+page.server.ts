import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import {
	getstudentpublicationbyid,
	updateStudentPublication
} from '$lib/repository/admin/article/penelitian/publikasiMahasiswa';
import type { StudentPublicationFormValues } from '$lib/types/values/admin/article';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const { id } = params;

	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	try {
		const data = await getstudentpublicationbyid(id);

		return {
			studentPublication: data
		};
	} catch (err: any) {
		if (err.status === 404) throw err;
		// console.error('Error fetching student publication:', err);
		// throw error(500, 'Gagal mengambil data publikasi mahasiswa.');
		return errorResponse('Gagal mengambil data publikasi mahasiswa.', 'Kesalahan Sistem');
	}
};

// Menangani aksi UPDATE
export const actions: Actions = {
	update: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		const values: StudentPublicationFormValues = {
			id,
			student_name: (formData.get('student_name') as string)?.trim() || '',
			journal_list: (formData.get('journal_list') as string)?.trim() || '',
			image_url: formData.get('image_url')?.toString().trim() || '',
			image_public_id: formData.get('image_public_id')?.toString().trim() || null
		};

		if (!id) {
			return fail(400, {
				...errorResponse('ID Publikasi Mahasiswa tidak ditemukan di URL.', 'Validasi Gagal')
			});
		}

		if (!values.student_name) {
			return fail(400, {
				...warningResponse('Nama mahasiswa wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		if (!values.journal_list) {
			return fail(400, {
				...warningResponse('Daftar jurnal wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			await updateStudentPublication(
				id,
				values.student_name,
				values.journal_list,
				values.image_url,
				values.image_public_id
			);

			return successResponse('Data publikasi mahasiswa berhasil diperbarui.', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating student publication:', err);

			return fail(500, {
				...errorResponse('Gagal memperbarui data publikasi mahasiswa.', 'Kesalahan Server'),
				values
			});
		}
	},
	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const publicId = formData.get('public_id')?.toString();

		console.info('module : id ', publicId);

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
