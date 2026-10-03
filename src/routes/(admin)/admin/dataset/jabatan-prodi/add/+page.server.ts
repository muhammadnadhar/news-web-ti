import { fail, type Actions } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { createJabatanProdi } from '$lib/repository/admin/dataset/jabatanProdi';
import type { JabatanProdiFormValues } from '$lib/types/values/admin/dataset';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		// Ekstraksi data ke objek values bertipe JabatanProdiFormValues
		const values: JabatanProdiFormValues = {
			id: (formData.get('id') as string)?.trim() || randomUUID(),
			name: formData.get('name')?.toString().trim() || ''
		};

		// Validasi Nama Wajib Diisi
		if (!values.name) {
			return fail(400, {
				...warningResponse('Nama Jabatan Prodi wajib diisi.', 'Validasi Gagal'),
				values
			});
		}

		try {
			await createJabatanProdi(values.id!, values.name);

			return successResponse('Jabatan Prodi baru berhasil ditambahkan!', 'Berhasil');
		} catch (err: any) {
			console.error('Error creating Jabatan Prodi:', err);

			// Pengecekan entri ganda / duplicate entry database jika nama sudah ada
			if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
				return fail(400, {
					...warningResponse(
						`Nama Jabatan Prodi "${values.name}" sudah terdaftar.`,
						'Gagal Menyimpan'
					),
					values
				});
			}

			return fail(500, {
				...errorResponse(
					err?.message || 'Terjadi kesalahan saat menyimpan data ke database.',
					'Gagal Menyimpan'
				),
				values
			});
		}
	}
};
