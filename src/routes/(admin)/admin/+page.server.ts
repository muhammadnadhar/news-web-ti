import { redirect } from '@sveltejs/kit';

export function load() {
	// Mengalihkan ke sub-URL dengan status kode 307 (Temporary Redirect)
	redirect(307, '/admin/dashboard');
}
