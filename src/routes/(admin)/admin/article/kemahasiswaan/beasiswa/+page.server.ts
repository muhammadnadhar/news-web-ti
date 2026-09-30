import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import {
	deleteScholarship,
	getAllScholarships,
	getScholarshipById,
	getScholarshipPublicImageIdyId
} from '$lib/repository/admin/article/kemahasiswaan/beasiswa';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';

export const load: PageServerLoad = async () => {
	try {
		// const rawList = await getAllScholarships();

		// Transformasi data DB ke format TableContentType untuk komponen TableContent
		// const scholarshipList: TableContentType[] = rawList.map((item) => ({
		// 	id: item.id,
		// 	items: [
		// 		{
		// 			colomn: 'Nama',
		// 			row: item.student_name
		// 		},
		// 		{
		// 			colomn: 'Beasiswa',
		// 			row: item.scholarship_name
		// 		}
		// 	]
		// }));

		return {
			// scholarshipList,
			rawScholarshipList: getAllScholarships()
		};
	} catch (err) {
		console.error('Error loading scholarships:', err);
		throw error(500, 'Gagal mengambil data Beasiswa.');
	}
};

export const actions: Actions = {
	// save: async ({ request }) => {
	// 	const formData = await request.formData();
	// 	const id = (formData.get('id') as string) || crypto.randomUUID();
	// 	const isEdit = formData.get('is_edit') === 'true';
	// 	const studentName = formData.get('student_name') as string;
	// 	const scholarshipName = formData.get('scholarship_name') as string;
	//
	// 	if (!studentName || !scholarshipName) {
	// 		return fail(400, { message: 'Nama Mahasiswa dan Jenis Beasiswa wajib diisi.' });
	// 	}
	//
	// 	try {
	// 		if (isEdit) {
	// 			await updateScholarship(id, studentName, scholarshipName);
	// 		} else {
	// 			await createScholarship(id, studentName, scholarshipName);
	// 		}
	// 		return { success: true };
	// 	} catch (err) {
	// 		console.error('Error saving scholarship:', err);
	// 		return fail(500, { message: 'Gagal menyimpan data Beasiswa.' });
	// 	}
	// },
	//
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString().trim();

		if (!id) {
			return fail(400, warningResponse('ID Beasiswa wajib disertakan.', 'Gagal'));
		}

		try {
			const public_id = await getScholarshipPublicImageIdyId(id);

			if (!public_id) {
				return fail(
					404,
					warningResponse('Data Beasiswa tidak ditemukan atau sudah dihapus.', 'Gagal')
				);
			}

			// Hapus gambar/poster beasiswa dari Cloudinary jika ada
			if (public_id.image_public_id) {
				await deleteImageFromCloudinary(public_id.image_public_id);
			}

			await deleteScholarship(id);

			return successResponse('Data Beasiswa dan poster terkait berhasil dihapus.', 'Berhasil');
		} catch (err: any) {
			console.error('Error deleting scholarship:', err);
			return fail(
				500,
				errorResponse(
					err?.message
						? `Gagal menghapus data: ${err.message}`
						: 'Terjadi kesalahan sistem saat menghapus data Beasiswa.',
					'Kesalahan Sistem'
				)
			);
		}
	}
};
