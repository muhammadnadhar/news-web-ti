import type { ImageItem } from '$lib/dto/admin/home';
import { deleteImageFromCloudinary } from '$lib/helper/cloudinary';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import {
	getCurriculumsById,
	saveOrUpdateCurriculum,
	updateCurriculumImages,
	updateCurriculumText
} from '$lib/repository/admin/article/kurikulum/kurikulum';
import type { kurikulumsFormValues } from '$lib/types/values/admin/article';
import type { Actions, PageServerLoad } from './$types';
import { fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});
	const { id } = params;

	const currikulums = await getCurriculumsById(id);

	if (!currikulums) {
		throw error(404, {
			message: 'Dokumentasi kegiatan tidak ditemukan'
		});
	}

	return {
		currikulums
	};
};

/**
 * Memproses pembaruan data dokumentasi kegiatan
 */
export const actions: Actions = {
	update: async ({ request }) => {
		const formData = await request.formData();

		const description = formData.get('description')?.toString().trim() || '';
		const title = formData.get('title')?.toString() || '[]';
		const imagesRaw = formData.get('images_json')?.toString() || '[]';
		const id = formData.get('id')?.toString();

		let images: ImageItem[] = [];
		try {
			images = JSON.parse(imagesRaw);
		} catch (e) {
			images = [];
		}

		const values: kurikulumsFormValues = {
			description,
			images,
			title,
			id: id ?? ''
		};

		if (!values.description) {
			return fail(400, {
				...warningResponse('Deskripsi kurikulum wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			//Panggil helper method repository saveOrUpdateObeCurriculum
			const isUpdateCuriculum = await updateCurriculumText(
				values.id,
				values.title,
				values.description
			);
			if (!isUpdateCuriculum) {
				return fail(400, {
					...errorResponse(
						'Data tidak mengalami perubahan atau gagal diperbarui.',
						'Gagal Menyimpan'
					),
					values
				});
			}
			const isImage = await updateCurriculumImages(values.id, values.images);
			if (!isImage) {
				return fail(400, {
					...errorResponse('Data Image gagal diperbarui.', 'Gagal Menyimpan'),
					values
				});
			}

			return successResponse('Kurikulum berhasil diperbarui.', 'Berhasil');
		} catch (err: any) {
			console.error('Error saat update kurikulum:', err);
			return fail(500, {
				...errorResponse(
					'Terjadi kesalahan sistem saat memperbarui data kurikulum.',
					'Kesalahan Server'
				),
				values
			});
		}
	},
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
