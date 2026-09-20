import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllHistoryLeaders, getHistoryContent } from '$lib/repository/admin/article/profile/sejarah';


// Helper untuk mengonversi Buffer / BLOB foto ke Base64 Data URL
function formatPhoto(photo: Buffer | string | null | undefined): string | null {
	if (!photo) return null;
	if (typeof photo === 'string') return photo; // Jika sudah berupa URL / String Base64
	if (Buffer.isBuffer(photo)) {
		return `data:image/jpeg;base64,${photo.toString('base64')}`;
	}
	return null;
}

export const load: PageServerLoad = async () => {
	try {
		const [historyContent, rawLeaders] = await Promise.all([
			getHistoryContent(),
			getAllHistoryLeaders()
		]);

		// Format foto BLOB ke Base64 agar dapat dibaca di halaman browser
		const historyLeaders = rawLeaders.map((leader) => ({
			...leader,
			head_photo: formatPhoto(leader.head_photo),
			secretary_photo: formatPhoto(leader.secretary_photo)
		}));

		return {
			historyContent,
			historyLeaders
		};
	} catch (err) {
		console.error('Error loading history data:', err);
		throw error(500, 'Gagal mengambil data sejarah');
	}
};
