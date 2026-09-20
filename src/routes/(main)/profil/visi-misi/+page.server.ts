import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getVisiMisi } from '$lib/repository/admin/article/profile/visiMisi';

export const load: PageServerLoad = async () => {
	try {
		const visiMisiData = await getVisiMisi();

		return {
			visiMisiData
		};
	} catch (err) {
		console.error('Error loading Visi Misi:', err);
		throw error(500, 'Gagal mengambil data Visi & Misi');
	}
};
