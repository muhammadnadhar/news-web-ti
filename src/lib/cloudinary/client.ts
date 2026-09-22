import {
	PUBLIC_CLOUDINARY_CLOUD_NAME,
	PUBLIC_CLOUDINARY_UPLOAD_PRESET,
	PUBLIC_CLOUDINARY_API_KEY
} from '$env/static/public';

// import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';

/**
 * Helper Frontend: Otomatis mengambil Cloud Name tanpa parameter.
 * (Aman digunakan di file .svelte atau komponen frontend)
 */
export function getUploadOptions(folder: string = 'default') {
	return {
		folder: folder,

		multiple: false,
		singleUploadAutoSubmit: false // 👈 Menahan gambar agar tidak langsung upload
	};
}

/**
 * Helper Otomatis: Mengembalikan objek konfigurasi Cloudinary yang valid
 * sesuai dengan struktur properti `config` bawaan svelte-cloudinary.
 */
export function getUploadConfig() {
	return {
		cloud: {
			cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
			apiKey: PUBLIC_CLOUDINARY_API_KEY
		}
	};
}

// Eksport Preset Publik untuk widget
export const upload_cloudinary_preset = PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// folder folder di Cloudinary
// pisahkan berdasarkan folder /root/subfolder
export const folder_cloudinary_admin_article_akademik = 'admin/article/akademik';
export const folder_cloudinary_admin_article_berita = 'admin/article/berita';
export const folder_cloudinary_admin_article_kerjasama = 'admin/article/kerjasama';
export const folder_cloudinary_admin_article_kurikulum = 'admin/article/kurikulum';
export const folder_cloudinary_admin_article_penelitian = 'admin/article/penelitan';
export const folder_cloudinary_admin_article_kemahasiswaan = 'admin/article/kemahasiswana';
export const folder_cloudinary_admin_article_profil = 'admin/article/profil';

export const folder_cloudinary_admin_dataset_angkatan = 'admin/dataset/angkatan';
export const folder_cloudinary_admin_dataset_semester = 'admin/dataset/semester';

export const folder_cloudinary_admin_home_profilDashboard = 'admin/home/profileDashboard';

/**
 * Helper Backend: MengeloGmpokkan kredensial rahasia untuk keperluan server.
 * (Hanya boleh dipanggil di file server seperti +page.server.ts atau +server.ts)
 */ // export function getServerCredentials() {
// 	return {
// 		apiKey: CLOUDINARY_API_KEY,
// 		apiSecret: CLOUDINARY_API_SECRET,
// 		cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME
// 	};
// }
