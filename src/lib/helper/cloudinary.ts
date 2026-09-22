import { cloudinary } from "$lib/cloudinary/server";

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
