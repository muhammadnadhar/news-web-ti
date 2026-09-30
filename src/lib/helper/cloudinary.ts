import { cloudinary } from '$lib/cloudinary/server';

/**
 * Helper function untuk mengekstrak Public ID Cloudinary dari Image URL.
 * Contoh URL: https://res.cloudinary.com/demo/image/upload/v1612345678/folder/sample.jpg
 * Hasil public_id: folder/sample
 */
function getCloudinaryPublicId(url: string): string | null {
	try {
		// Matching pola URL Cloudinary untuk mengambil path setelah '/upload/' dan versi (v123456/)
		const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
		const match = url.match(regex);
		return match ? match[1] : null;
	} catch (err) {
		console.error('Gagal mengekstrak Public ID dari URL:', err);
		return null;
	}
}

/**
 * Helper untuk menghapus gambar dari Cloudinary
 */
export async function deleteCloudinaryImage(imageUrl: string): Promise<boolean> {
	const publicId = getCloudinaryPublicId(imageUrl);
	if (!publicId) return false;

	try {
		const result = await cloudinary.uploader.destroy(publicId);
		return result.result === 'ok';
	} catch (err) {
		console.error('Error saat menghapus gambar di Cloudinary:', err);
		return false;
	}
}

/**
 * Menghapus media/gambar dari Cloudinary berdasarkan public_id.
 *
 * @param publicId - Public ID dari gambar di Cloudinary (misal: "rekrutmen/poster_123")
 * @param resourceType - Tipe resource (default: "image", opsi lain: "raw", "video")
 * @returns Promise<boolean> - Returns true jika berhasil dihapus / tidak ditemukan, false jika gagal.
 */
export async function deleteImageFromCloudinary(
	publicId: string | null | undefined,
	resourceType: 'image' | 'raw' | 'video' = 'image'
): Promise<boolean> {
	// 1. Validasi jika publicId kosong
	if (!publicId) {
		console.warn('[Cloudinary Delete] Public ID kosong/null, proses dilewati.');
		return false;
	}

	try {
		// Panggil API uploader.destroy dari Cloudinary SDK
		const result = await cloudinary.uploader.destroy(publicId, {
			resource_type: resourceType,
			invalidate: true // Otomatis bersihkan cache CDN Cloudinary
		});

		// Response dari Cloudinary biasanya: { result: 'ok' } atau { result: 'not found' }
		if (result.result === 'ok' || result.result === 'not found') {
			console.log(`[Cloudinary Delete Success]: ${publicId} (${result.result})`);
			return true;
		} else {
			console.error(`[Cloudinary Delete Failed]: ${publicId}`, result);
			return false;
		}
	} catch (error) {
		console.error(`[Cloudinary Delete Error] Gagal menghapus ${publicId}:`, error);
		// Mengembalikan false agar flow aplikasi utama tidak terputus/crash jika hapus gambar gagal
		return false;
	}
}
