import { error, fail, type Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import {
	getJabatanProdiById,
	updateJabatanProdi
} from '$lib/repository/admin/dataset/jabatanProdi';
import type { JabatanProdiFormValues } from '$lib/types/values/admin/dataset';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const position = await getJabatanProdiById(id);

	if (!position) {
		throw error(404, 'Data Jabatan Prodi tidak ditemukan.');
	}

	return { position };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe JabatanProdiFormValues
		const values: JabatanProdiFormValues = {
			id: params.id || (formData.get('id') as string)?.trim(),
			name: formData.get('name')?.toString().trim() || ''
		};

		// Validasi ID
		if (!values.id) {
			return fail(400, {
				...errorResponse('ID Jabatan Prodi tidak ditemukan.', 'Validasi Gagal'),
				values
			});
		}

		// Validasi Nama
		if (!values.name) {
			return fail(400, {
				...warningResponse('Nama Jabatan Prodi wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			await updateJabatanProdi(values.id, values.name);

			return successResponse('Data Jabatan Prodi berhasil diperbarui!', 'Berhasil');
		} catch (err: any) {
			console.error('Error updating Jabatan Prodi:', err);

			if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
				return fail(400, {
					...warningResponse(`Nama Jabatan Prodi "${values.name}" sudah ada.`, 'Gagal Memperbarui'),
					values
				});
			}

			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan saat memperbarui data di database.',
					'Gagal Memperbarui'
				),
				values
			});
		}
	}
};
