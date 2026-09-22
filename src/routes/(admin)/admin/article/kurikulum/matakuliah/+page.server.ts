import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { errorResponse, successResponse } from '$lib/helper/message';
import {
	deleteCourseMap,
	getAllCourseMap
} from '$lib/repository/admin/article/kurikulum/petaMatakuliah';

export const load: PageServerLoad = async () => {
	try {
		// const rawList = await getAllCourseMap();
		// Transformasi data DB ke format TableContentType untuk komponen TableContent
		// const courseMapList: TableContentType[] = rawList.map((item) => ({
		// 	id: item.id,
		// 	items: [
		// 		{
		// 			colomn: 'Judul Peta Mata Kuliah',
		// 			row: item.title
		// 		},
		// 		{
		// 			colomn: 'Foto',
		// 			row: item.image_url || '-'
		// 		}
		// 	]
		// }));

		return {
			// courseMapList,
			rawCourseMapList: getAllCourseMap() // lazy streaming sveltekit
		};
	} catch (err) {
		console.error('Error loading course map:', err);
		// throw error(500, 'Gagal mengambil data Peta Mata Kuliah.');
		return errorResponse('Gagal mengambil data Peta Mata Kuliah.', 'Kesalahan Sistem');
	}
};

export const actions: Actions = {
	// save: async ({ request }) => {
	// 	const formData = await request.formData();
	// 	const id = (formData.get('id') as string) || crypto.randomUUID();
	// 	const isEdit = formData.get('is_edit') === 'true';
	// 	const title = formData.get('title') as string;
	// 	const imageFile = formData.get('image') as File;
	//
	// 	if (!title) {
	// 		return fail(400, { message: 'Judul Peta Mata Kuliah wajib diisi.' });
	// 	}
	//
	// 	// Handle upload file gambar
	// 	let imageUrl: string | null = null;
	// 	if (imageFile && imageFile.size > 0) {
	// 		const uploadDir = join(process.cwd(), 'static', 'uploads', 'peta-matakuliah');
	// 		if (!existsSync(uploadDir)) {
	// 			mkdirSync(uploadDir, { recursive: true });
	// 		}
	//
	// 		const ext = imageFile.name.split('.').pop();
	// 		const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
	// 		const filePath = join(uploadDir, fileName);
	// 		const buffer = Buffer.from(await imageFile.arrayBuffer());
	//
	// 		writeFileSync(filePath, buffer);
	// 		imageUrl = `/uploads/peta-matakuliah/${fileName}`;
	// 	}
	//
	// 	if (!isEdit && !imageUrl) {
	// 		return fail(400, { message: 'Foto peta mata kuliah wajib diunggah.' });
	// 	}
	//
	// 	try {
	// 		if (isEdit) {
	// 			await updateCourseMap(id, title, imageUrl);
	// 		} else {
	// 			await createCourseMap(id, title, imageUrl!);
	// 		}
	// 		return { success: true };
	// 	} catch (err) {
	// 		console.error('Error saving course map:', err);
	// 		return fail(500, { message: 'Gagal menyimpan data Peta Mata Kuliah.' });
	// 	}
	// },

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, errorResponse('ID data tidak ditemukan.', 'Gagal Menghapus'));
		}

		try {
			await deleteCourseMap(id);

			// Success Response
			return successResponse('Data peta mata kuliah berhasil dihapus.', 'Berhasil');
		} catch (error: any) {
			console.error('Error deleting course map:', error);

			// Error Response Sistem
			return fail(
				500,
				errorResponse(error.message || 'Terjadi kesalahan sistem', 'Gagal Hapus Data')
			);
		}
	}
};
