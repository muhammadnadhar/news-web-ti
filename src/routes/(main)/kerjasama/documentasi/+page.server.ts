import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllActivityDocumentations } from '$lib/server/admin/repository/article/kerjasama/documentasi';

export const load: PageServerLoad = async () => {
	try {
		const documentations = await getAllActivityDocumentations();

		return {
			documentations
		};
	} catch (err) {
		console.error('Error loading Activity Documentations:', err);
		throw error(500, 'Gagal mengambil data Dokumentasi Kegiatan');
	}
};
