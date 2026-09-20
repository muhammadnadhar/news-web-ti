import { sessionAdmin } from '$lib/constants';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Logika SEBELUM request diproses (misal: Validasi Token/Session)
	console.log(`Ada request masuk ke: ${event.url.pathname}`);
	// Ambil data cookie session (sesuaikan dengan sistem auth Anda)
	const session = event.cookies.get(sessionAdmin);
	const path = event.url.pathname;

	console.info('session : ', session);

	// Simpan ke locals agar bisa diakses di seluruh +page.server.ts / +layout.server.ts
	if (session) {
		event.locals.session = session;
	}

	if (path.startsWith('/admin') && !path.startsWith('/admin/signIn')) {
		if (!session) {
			// Redirect paksa ke halaman login jika tidak ada session
			throw redirect(303, '/admin/signIn');
		}
	}

	// Jika user SUDAH login dan mencoba mengakses /admin/signIn, arahkan ke Dashboard
	if (path.startsWith('/admin/signIn') && session) {
		throw redirect(303, '/admin');
	}

	// Menjalankan request untuk mendapatkan response
	const response = await resolve(event);
	response.headers.set('x-custom-header', 'Halo-Dari-Middleware');
	return response;
};
