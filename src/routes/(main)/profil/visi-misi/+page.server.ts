import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getVisiMisi } from '$lib/repository/admin/article/profile/visiMisi';

export const load: PageServerLoad = async () => {
	try {

		return {
			visiMisiData : 		getVisiMisi(),
		};
	} catch (err) {
		console.error('Error loading Visi Misi:', err);
		throw error(500, 'Gagal mengambil data Visi & Misi');
	}
};
