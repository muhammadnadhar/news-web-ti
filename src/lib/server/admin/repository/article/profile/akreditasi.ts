import { query } from '$lib/server/database/svelteDb';
import { tableAccreditation } from '$lib/seeder/admin/article/profile';
import type { AccreditationItemDTO, CreateAccreditationData } from '$lib/types/admin/article/profile';


/**
 * Mengambil semua data akreditasi (Read All)
 */
export async function getAllAccreditations(): Promise<AccreditationItemDTO[]> {
	const sql = `SELECT * FROM ${tableAccreditation} ORDER BY created_at DESC`;
	const rows = (await query(sql)) as AccreditationItemDTO[];
	return rows;
}
/**
 *mendapatkan data akreditasi (read singleton)
 * Mengambil baris pertama dari tabel akreditasi
 */
export async function getAccreditation(): Promise<AccreditationItemDTO | null> {
	const sql = `SELECT * FROM ${tableAccreditation} ORDER BY created_at ASC LIMIT 1`;
	const rows = (await query(sql)) as AccreditationItemDTO[];
	if (!rows || rows.length === 0) return null;
	return rows[0];
}

/**
 * TAMBAH / UPDATE DATA AKREDITASI (Upsert)
 */
export async function upsertAccreditation(id: string, data: CreateAccreditationData): Promise<boolean> {
	const sql = `
		INSERT INTO ${tableAccreditation} (id, image_url, description)
		VALUES (?, ?, ?)
		ON DUPLICATE KEY UPDATE
			image_url = VALUES(image_url),
			description = VALUES(description),
			updated_at = CURRENT_TIMESTAMP
	`;
	const params = [id, data.image_url || null, data.description];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * 3. HAPUS FOTO SERTIFIKAT AKREDITASI
 */
export async function deleteAccreditationImage(id: string): Promise<boolean> {
	const sql = `UPDATE ${tableAccreditation} SET image_url = NULL WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
