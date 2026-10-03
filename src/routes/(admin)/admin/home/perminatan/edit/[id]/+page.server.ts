import { getPerminatanTIById, updatePerminatanTI } from '$lib/repository/admin/home/tablePermitan';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PeminatanFormValues } from '$lib/types/values/admin/home';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';

export const load: PageServerLoad = async ({ params }) => {
	const peminatan = await getPerminatanTIById(params.id);

	if (!peminatan) {
		throw error(404, 'Data peminatan tidak ditemukan');
	}

	return { peminatan };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe PeminatanFormValues
		const values: PeminatanFormValues = {
			id: (formData.get('id') as string)?.trim() || params.id,
			title: formData.get('title')?.toString().trim() || '',
			description: formData.get('description')?.toString().trim() || ''
		};

		// Validasi ID
		if (!values.id) {
			return fail(400, {
				...errorResponse('ID Peminatan tidak ditemukan.', 'Validasi Gagal'),
				values
			});
		}

		// Validasi Judul Peminatan
		if (!values.title || values.title.length > 150) {
			return fail(400, {
				...warningResponse(
					'Judul peminatan wajib diisi dan maksimal 150 karakter.',
					'Validasi Gagal'
				),
				values
			});
		}

		// Validasi Deskripsi Peminatan
		if (!values.description) {
			return fail(400, {
				...warningResponse('Deskripsi peminatan wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			const updated = await updatePerminatanTI(values.id, {
				title: values.title,
				description: values.description
			});

			if (!updated) {
				return fail(400, {
					...errorResponse(
						'Data tidak ditemukan atau tidak ada perubahan yang disimpan.',
						'Gagal Memperbarui'
					),
					values
				});
			}

			return successResponse('Data peminatan TI berhasil diperbarui.', 'Berhasil Diperbarui!');
		} catch (err: any) {
			console.error('Error in updatePerminatanTI:', err);

			return fail(500, {
				...errorResponse(
					err?.message || 'Gagal memperbarui data peminatan ke database.',
					'Terjadi Kesalahan'
				),
				values
			});
		}
	}
};
