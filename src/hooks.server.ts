import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Logika SEBELUM request diproses (misal: Validasi Token/Session)
	console.log(`Ada request masuk ke: ${event.url.pathname}`);
	// Ambil data cookie session (sesuaikan dengan sistem auth Anda)
	const session = event.cookies.get('session_id');

	// Periksa apakah user mencoba mengakses halaman yang butuh proteksi
	// if (event.url.pathname.startsWith('/admin')) {
	// 	if (!session) {
	// 		// Redirect paksa ke halaman login jika tidak ada session
	// 		throw redirect(303, '/admin/signIn');
	// 	}
	// }

	// Menjalankan request untuk mendapatkan response
	const response = await resolve(event);

	// Logika SESUDAH request diproses (misal: Menambahkan custom header)
	response.headers.set('x-custom-header', 'Halo-Dari-Middleware');

	return response;
};
