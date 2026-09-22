import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getActivityDocumentationById,
	updateActivityDocumentation
} from '$lib/repository/admin/article/kerjasama/documentasi';
// Sesuaikan import path repository Anda

/**
 * LOAD DATA:
 * Mengambil data dokumentasi berdasarkan ID dari URL parameter
 */
export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const documentation = await getActivityDocumentationById(id);

	if (!documentation) {
		throw error(404, {
			message: 'Dokumentasi kegiatan tidak ditemukan'
		});
	}

	return {
		documentation
	};
};

/**
 * FORM ACTIONS:
 * Memproses pembaruan data dokumentasi kegiatan
 */
export const actions: Actions = {
	default: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		const title = formData.get('title')?.toString().trim() || '';
		const imageUrl = formData.get('image_url')?.toString().trim() || '';
		const eventDate = formData.get('event_date')?.toString().trim() || null;
		const description = formData.get('description')?.toString().trim() || null;
		const linkDrive = formData.get('link_drive')?.toString().trim() || null;

		// Objek nilai untuk dikembalikan jika terjadi kegagalan/validasi
		const values = {
			id,
			title,
			image_url: imageUrl,
			event_date: eventDate,
			description
		};

		// 1. Validasi Kolom Wajib
		if (!title) {
			return fail(400, {
				success: false,
				title: 'Validasi Gagal',
				message: 'Judul kegiatan wajib diisi.',
				values
			});
		}

		if (!imageUrl) {
			return fail(400, {
				success: false,
				title: 'Validasi Gagal',
				message: 'Foto / media dokumentasi wajib diunggah.',
				values
			});
		}

		try {
			// Eksekusi Repository Method Update
			const isSuccess = await updateActivityDocumentation(
				id,
				title,
				imageUrl,
				description,
				eventDate,
				linkDrive
			);

			if (!isSuccess) {
				return fail(400, {
					success: false,
					title: 'Gagal Menyimpan',
					message: 'Data tidak mengalami perubahan atau gagal diperbarui.',
					values
				});
			}

			// 3. Kembalikan Response Berhasil (Sesuai penanganan pada komponen ActivityDocumentationForm)
			return {
				success: true,
				title: 'Berhasil',
				message: 'Dokumentasi kegiatan berhasil diperbarui.',
				values
			};
		} catch (err: any) {
			console.error('Error saat update dokumentasi kegiatan:', err);
			return fail(500, {
				success: false,
				title: 'Kesalahan Server',
				message: 'Terjadi kesalahan sistem saat memperbarui data dokumentasi.',
				values
			});
		}
	}
};
