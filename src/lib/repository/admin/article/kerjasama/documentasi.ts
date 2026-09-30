import { query } from '$lib/database/svelteDb';
import type { ActivityDocumentationDTO } from '$lib/dto/admin/article/kerjasama';
import { tableActivityDocumentation } from '$lib/seeder/admin/article/kerjasama';

/**
 * Mengambil seluruh data Dokumentasi Kegiatan
 */
export async function getAllActivityDocumentations(): Promise<ActivityDocumentationDTO[]> {
	const sql = `SELECT * FROM ${tableActivityDocumentation} ORDER BY created_at DESC`;
	return (await query(sql)) as ActivityDocumentationDTO[];
}

/**
 * Mengambil 1 data Dokumentasi Kegiatan berdasarkan ID
 */
export async function getActivityDocumentationById(
	id: string
): Promise<ActivityDocumentationDTO | null> {
	const sql = `SELECT * FROM ${tableActivityDocumentation} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as ActivityDocumentationDTO[];
	return rows[0] || null;
}
/**
 * Mengambil hanya image_public_id dari Dokumentasi Kegiatan berdasarkan ID
 *
 * @param id - ID Dokumentasi Kegiatan
 * @returns Promise<string | null> - Mengembalikan string image_public_id atau null jika tidak ada/ditemukan
 */
export async function getPublicIdActivityDocumentationById(id: string): Promise<string | null> {
	const sql = `SELECT image_public_id FROM ${tableActivityDocumentation} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as Array<{ image_public_id: string | null }>;

	return rows[0]?.image_public_id ?? null;
}

/**
 * Membuat data Dokumentasi Kegiatan baru
 */
export async function createActivityDocumentation(
	id: string,
	title: string,
	imageUrl: string | null,
	description: string | null,
	eventDate: string | null,
	linkDrive: string | null,
	imagePublicId: string | null = null
): Promise<boolean> {
	const sql = `
        INSERT INTO ${tableActivityDocumentation} (
            id, title, image_url, image_public_id, description, event_date, link_drive
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
	const result = (await query(sql, [
		id,
		title,
		imageUrl,
		imagePublicId,
		description || null,
		eventDate || null,
		linkDrive || null
	])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Dokumentasi Kegiatan
 */
export async function updateActivityDocumentation(
	id: string,
	title: string,
	imageUrl: string | null,
	description: string | null,
	eventDate: string | null,
	linkDrive: string | null,
	imagePublicId: string | null = null
): Promise<boolean> {
	const sql = `
        UPDATE ${tableActivityDocumentation} 
        SET 
            title = ?, 
            image_url = ?, 
            image_public_id = ?, 
            description = ?, 
            event_date = ?, 
            link_drive = ?, 
            updated_at = NOW() 
        WHERE id = ?
    `;
	const result = (await query(sql, [
		title,
		imageUrl,
		imagePublicId,
		description || null,
		eventDate || null,
		linkDrive || null,
		id
	])) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Dokumentasi Kegiatan
 */
export async function deleteActivityDocumentation(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableActivityDocumentation} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
