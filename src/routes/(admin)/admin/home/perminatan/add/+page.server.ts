import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { addPerminatanTI } from '$lib/repository/admin/home/tablePermitan';
import type { PeminatanFormValues } from '$lib/types/values/admin/home';
import { randomUUID } from '$lib/crypto';

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe PeminatanFormValues
		const values: PeminatanFormValues = {
			id: randomUUID(),
			title: formData.get('title')?.toString().trim() || '',
			description: formData.get('description')?.toString().trim() || ''
		};

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
			const data = await addPerminatanTI(values.id ?? randomUUID(), {
				title: values.title,
				description: values.description
			});

			if (!data) {
				return fail(500, {
					...errorResponse('Gagal membuat data peminatan TI.', 'Gagal Menyimpan'),
					values
				});
			}

			return successResponse(
				'Data peminatan TI baru telah berhasil ditambahkan.',
				'Berhasil Disimpan!'
			);
		} catch (err: any) {
			console.error('Error in addPeminatanTI:', err);

			return fail(500, {
				...errorResponse(
					err?.message ||
						'Gagal menyimpan data peminatan ke database. Silakan coba beberapa saat lagi.',
					'Terjadi Kesalahan'
				),
				values
			});
		}
	}
};
