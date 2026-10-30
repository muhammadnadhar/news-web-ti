import { goto } from '$app/navigation';
import type { NavMenuItemType, NavMenuType, SubMenuItem } from './types/navbar';
import type { dynamicMenuType } from './types/utils';
import { CurrencyIcon, type Component } from 'lucide-svelte';

export function mergeNewPath(newPath: string): string {
	// Ambil URL saat ini
const url = typeof window !== 'undefined' ? new URL(window.location.href) : { searchParams: new URLSearchParams() };
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
const url = typeof window !== 'undefined' ? new URL(window.location.href) : { searchParams: new URLSearchParams() };

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

/**
 * Memformat objek Date atau string tanggal ke dalam format string standar 
 * yang kompatibel dengan elemen HTML <input type="datetime-local"> (YYYY-MM-DDTHH:mm).
 * 
 * @param date - Objek Date atau string tanggal yang ingin diformat
 * @returns String tanggal dan waktu dalam format lokal ISO tanpa zona waktu (YYYY-MM-DDTHH:mm)
 */
export function formatDateTimeLocal(date: Date): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function stripHtml(html: string): string {
	if (!html) return '';
	return html.replace(/<[^>]*>?/gm, '');
}

export function convertYouTubeUrlToEmbed(url: string): string {
	let videoId = '';

	// Menangkap ID dari format watch?v=ID atau youtu.be/ID
	if (url.includes('watch?v=')) {
		videoId = url.split('watch?v=')[1]?.split('&')[0];
	} else if (url.includes('youtu.be/')) {
		videoId = url.split('youtu.be/')[1]?.split('?')[0];
	} else if (url.includes('embed/')) {
		return url; // Sudah format embed
	}

	return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}
// Helper function untuk memformat sub-menu (seperti Semester)
const formatSubMenu = (
	subMenu: SubMenuItem[] | undefined,
	basePath: string,
	param?: string
): SubMenuItem[] => {
	if (!subMenu || !Array.isArray(subMenu) || subMenu.length === 0) return [];

	return subMenu.map((item) => ({
		id: item.id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
		label: item.label, // Menggunakan item.label sesuai interface SubMenuItem
		href: param
			? `${basePath}?${param}=${encodeURIComponent(item.id)}`
			: `${basePath}\\${encodeURIComponent(item.id)}`
	}));
};

/**
 * Helper function untuk memformat data NavMenuType menjadi Menu Utama Navigasi
 */
const formatNavbarMenu = (
	data: NavMenuType | NavMenuType[] | undefined,
	basePath: string,
	icon?: Component
): NavMenuItemType[] => {
	if (!data) return [];
	const list = Array.isArray(data) ? data : [data];

	return list.map((item) => ({
		id: item.id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
		label: item.label
			? item.label.length > 20
				? item.label.substring(0, 20) + '...'
				: item.label
			: item.id,
		icon: item.icon || icon,
		bgClass: item.bgClass || 'text-bg-main hover:bg-scitech-slate-hover',
		href: item.href ? `${basePath}/${item.href}` : basePath,
		badge: item.badge ?? null,
		subMenu: [] // Sesuai dengan NavMenuItemType
	}));
}; /**
 * Fungsi utama untuk menghasilkan menu navigasi dinamis
 */
export function generateDynamicNavMenu(
	navMenuItems: NavMenuItemType[],
	data: dynamicMenuType
): NavMenuItemType[] {
	const menu = navMenuItems.map((m) => ({ ...m }));

	const kemahasiswaanMenu = menu.find((m) => m.id === 'kemahasiswaan');
	if (kemahasiswaanMenu && kemahasiswaanMenu.subMenu) {
		const prestasiAkademik = kemahasiswaanMenu.subMenu.find((c) => c.id === 'prestasi-akademik');
		if (prestasiAkademik && data.academic) {
			const subMenu: SubMenuItem[] = data.academic.map((i) => ({
				id: i.id,
				href: i.id,
				label: i.name
			}));
			prestasiAkademik.subMenu = formatSubMenu(subMenu, prestasiAkademik.href, 'semester_id');
		}

		const prestasiNonAkademik = kemahasiswaanMenu.subMenu.find(
			(c) => c.id === 'prestasi-non-akademik'
		);
		if (prestasiNonAkademik && data.nonAcademic) {
			const subMenu: SubMenuItem[] = data.nonAcademic.map((i) => ({
				id: i.id,
				href: i.id,
				label: i.name
			}));
			prestasiNonAkademik.subMenu = formatSubMenu(subMenu, prestasiNonAkademik.href, 'semester_id');
		}

		const ipkTertinggi = kemahasiswaanMenu.subMenu.find((c) => c.id === 'mahasiswa-ipk-tertinggi');
		if (ipkTertinggi && data.gpa) {
			const subMenu: SubMenuItem[] = data.gpa.map((i) => ({
				id: i.id,
				href: i.id,
				label: i.name
			}));
			ipkTertinggi.subMenu = formatSubMenu(subMenu, ipkTertinggi.href, 'semester_id');
		}
	}

	const curriculumMenu = menu.find((c) => c.id === 'kurikulum');
	if (curriculumMenu && data.curriculums) {
		// const kurikulumList = Array.isArray(data.curriculums) ? data.curriculums : [data.curriculums];

		// // Map CurriculumDTO ke NavMenuType sebelum masuk ke formatNavbarMenu
		// const navMenuInputs: NavMenuType[] = kurikulumList.map((item) => ({
		// 	id: item.id,
		// 	label: item.title,
		// 	icon: CurrencyIcon ?? (() => null),
		// 	badge: null,
		// 	bgClass: 'text-bg-main hover:bg-scitech-slate-hover',
		// 	href: item.id // Akan digabungkan dengan basePath di dalam formatNavbarMenu
		// }));
		//
		// const formattedCurriculumMenus = formatNavbarMenu(navMenuInputs, '/kurikulum');
		// const curriculumIndex = menu.findIndex((m) => m.id === 'kurikulum');
		// if (curriculumIndex !== -1) {
		// 	menu.splice(curriculumIndex, 1, ...formattedCurriculumMenus);
		// } else {
		// 	menu.push(...formattedCurriculumMenus);
		// }
		const newCurriculumSubMenus: SubMenuItem[] = data.curriculums.map((i) => ({
			id: i.id,
			// *Bgdar : nantik jika ada fitur lanjutan di kurikulum maka bisa buat dinamys
			label: (i as any).title || (i as any).name || i.id,
			href: `/kurikulum/kurikulums/${i.id}`
		}));

		// Gabungkan dengan sub-menu yang sudah ada sebelumnya (jika ada)
		// Menggunakan operator spread (...) memastikan sub-menu lama tidak hilang
		curriculumMenu.subMenu = [
			...(curriculumMenu.subMenu || []),
			...formatSubMenu(newCurriculumSubMenus, '/kurikulum/kurikulums')
		];
	}

	return menu;
}
