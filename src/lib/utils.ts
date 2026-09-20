import { goto } from '$app/navigation';



export function mergeNewPath(newPath: string): string {
	// Ambil URL saat ini
	const url = new URL(window.location.href);
	//  Gabungkan path lama dengan path baru, lalu bersihkan garis miring ganda (//)
	const cleanPath = `${url.pathname}/${newPath}`.replace(/\/+/g, '/');
	//  Update pathname tanpa merusak search params atau hash
	url.pathname = cleanPath;

	return url.toString(); // Mengembalikan URL penuh yang baru
}

/*
 * Menghapus segmen path terakhir
 */
export function removeLastPath(): string {
	// if (!browser) return '';
	const url = new URL(window.location.href);
	const pathSegments = url.pathname.split('/');
	// Hapus elemen terakhir dari array jika path tidak kosong
	if (pathSegments.length > 1) {
		pathSegments.pop();
	}
	// Gabungkan kembali array menjadi string path, pastikan diawali '/'
	const cleanPath = pathSegments.join('/') || '/';
	url.pathname = cleanPath;
	return url.toString(); // Mengembalikan URL penuh setelah path terakhir dihapus
}

/*
 * untuk berpindah halaman ke Edit , guankan di tableContent pada edit
 */
export function gotoEdit(id: string | number, currentPathname: string) {
	if (!id) return;
	const cleanPath = currentPathname.replace(/\/$/, '');
	goto(`${cleanPath}/edit/${id}`);
}

/**
 * Helper internal untuk mengubah Buffer / Base64 / URL menjadi Data URI / String URL yang valid untuk HTML <img>
 */
export function parsePhotoToUrl(
	photo?: Buffer | string | null,
	mimeType: string = 'image/jpeg'
): string | null {
	if (!photo) return null;

	// Jika tipe data adalah Buffer (misal dari MySQL BLOB)
	if (typeof photo !== 'string' && Buffer.isBuffer(photo)) {
		const base64 = photo.toString('base64');
		return `data:${mimeType};base64,${base64}`;
	}

	// Jika bertipe string
	if (typeof photo === 'string') {
		// Jika sudah dalam format Data URI (data:image/...) atau HTTP URL (http://... / /uploads/...)
		if (photo.startsWith('data:') || photo.startsWith('http') || photo.startsWith('/')) {
			return photo;
		}
		// Jika berupa string Base64 murni tanpa prefix data URI
		return `data:${mimeType};base64,${photo}`;
	}

	return null;
}

/**
 * Helper internal untuk format tanggal ke format lokal Indonesia
 */
export function formatDate(date?: Date | string | null): string | null {
	if (!date) return null;
	const d = new Date(date);
	if (isNaN(d.getTime())) return null;

	return new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	}).format(d);
}

export function stripHtml(html: string): string {
	if (!html) return '';
	return html.replace(/<[^>]*>?/gm, '');
}
