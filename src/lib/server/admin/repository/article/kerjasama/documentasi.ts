import { tableActivityDocumentation } from '$lib/seeder/admin/article/kerjasama';
import { query } from '$lib/server/database/runtimeDb';
import type { ActivityDocumentationDTO } from '$lib/types/admin/article/kerjasama';

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
export async function getActivityDocumentationById(id: string): Promise<ActivityDocumentationDTO | null> {
	const sql = `SELECT * FROM ${tableActivityDocumentation} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as ActivityDocumentationDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Dokumentasi Kegiatan baru
 */
export async function createActivityDocumentation(
	id: string,
	title: string,
	imageUrl: string,
	description: string | null,
	eventDate: string | null
): Promise<boolean> {
	const sql = `INSERT INTO ${tableActivityDocumentation} (id, title, image_url, description, event_date) VALUES (?, ?, ?, ?, ?)`;
	const result = (await query(sql, [id, title, imageUrl, description || null, eventDate || null])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Dokumentasi Kegiatan
 */
export async function updateActivityDocumentation(
	id: string,
	title: string,
	imageUrl: string,
	description: string | null,
	eventDate: string | null
): Promise<boolean> {
	const sql = `UPDATE ${tableActivityDocumentation} SET title = ?, image_url = ?, description = ?, event_date = ?, updated_at = NOW() WHERE id = ?`;
	const result = (await query(sql, [title, imageUrl, description || null, eventDate || null, id])) as any;
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
