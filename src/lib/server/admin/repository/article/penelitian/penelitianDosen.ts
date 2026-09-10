import { tableLecturerResearch } from '$lib/seeder/admin/article/penelitian';
import { query } from '$lib/server/database/runtimeDb';
import type { LecturerResearchDTO } from '$lib/types/admin/article/penelitian';

/**
 * Mengambil data Penelitian Dosen (Ambil baris pertama)
 */
export async function getLecturerResearch(): Promise<LecturerResearchDTO | null> {
	const sql = `SELECT * FROM ${tableLecturerResearch} LIMIT 1`;
	const rows = (await query(sql)) as LecturerResearchDTO[];
	return rows[0] || null;
}

/**
 * Menyimpan atau Memperbarui data Penelitian Dosen (UPSERT logic)
 */
export async function saveOrUpdateLecturerResearch(description: string): Promise<boolean> {
	const existing = await getLecturerResearch();

	if (existing) {
		const sql = `UPDATE ${tableLecturerResearch} SET description = ?, updated_at = NOW() WHERE id = ?`;
		const result = (await query(sql, [description, existing.id])) as any;
		return result.affectedRows > 0;
	} else {
		const newId = crypto.randomUUID();
		const sql = `INSERT INTO ${tableLecturerResearch} (id, description) VALUES (?, ?)`;
		const result = (await query(sql, [newId, description])) as any;
		return result.affectedRows > 0;
	}
}
