import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllLecturerPublications } from '$lib/repository/admin/article/penelitian/publikasiDosen';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	try {
		return {
			// Mengembalikan promise agar SvelteKit dapat melakukan streaming data & menampilkan loading
			streamed: {
				publications: (async () => {
					// Gunakan await pada Promise.all agar mengembalikan array hasil resolve
					const [pubs, staffList] = await Promise.all([
						getAllLecturerPublications(),
						getAllLecturerStaff()
					]);

					// Buat map untuk lookup cepat berdasarkan lecturer_id
					const staffMap = new Map(staffList.map((staff) => [staff.id, staff]));

					// Gabungkan foto & info detail ke dalam data publikasi
					return pubs.map((pub) => {
						const staff = staffMap.get(pub.lecturer_id);
						return {
							...pub,
							nidn: staff?.nidn || pub.nidn || null,
							photo_url: staff?.photo_url || null
						};
					});
				})()
			}
		};
	} catch (err) {
		console.error('Error loading lecturer publications:', err);
		throw error(500, 'Gagal memuat data publikasi dan profil dosen.');
	}
};
