import type { PageServerLoad } from './$types';
import { getAllActivityDocumentations } from '$lib/repository/admin/article/kerjasama/documentasi';
import { errorResponse } from '$lib/helper/message';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	try {
		const documentations = await getAllActivityDocumentations();

		return {
			documentations
		};
	} catch (err) {
		console.error('Error loading Activity Documentations:', err);
		// throw error(500, 'Gagal mengambil data Dokumentasi Kegiatan');
		return errorResponse('Gagal Loading Activity Documentations', 'Error load');
	}
};
