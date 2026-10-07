import { sessionAdmin } from '$lib/constants';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// console.log(`Ada request masuk ke: ${event.url.pathname}`);
  
	const session = event.cookies.get(sessionAdmin);
	const path = event.url.pathname;


	// Simpan ke locals agar bisa diakses di seluruh +page.server.ts / +layout.server.ts
	if (session) {
		event.locals.session = session;
	}

	if (path.startsWith('/admin') && !path.startsWith('/admin/signIn')) {
		if (!session) {
			throw redirect(303, '/admin/signIn');
		}
	}

	if (path.startsWith('/admin/signIn') && session) {
		throw redirect(303, '/admin');
	}

	// Menjalankan request untuk mendapatkan response
	const response = await resolve(event);
	response.headers.set('x-custom-header', 'hey-from-Middleware');
	return response;
};
