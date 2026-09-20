import { query } from '$lib/database/svelteDb';
import type { ObeCurriculumDTO } from '$lib/dto/admin/article/kurikulum';
import { tableObeCurriculum } from '$lib/seeder/admin/article/kurikulum';

/**
 * Mengambil data Kurikulum OBE (Ambil baris pertama)
 */
export async function getObeCurriculum(): Promise<ObeCurriculumDTO | null> {
	const sql = `SELECT * FROM ${tableObeCurriculum} LIMIT 1`;
	const rows = (await query(sql)) as ObeCurriculumDTO[];
	return rows[0] || null;
}

/**
 * Menyimpan atau Memperbarui data Kurikulum OBE (UPSERT logic)
 */
export async function saveOrUpdateObeCurriculum(description: string): Promise<boolean> {
	const existing = await getObeCurriculum();

	if (existing) {
		const sql = `UPDATE ${tableObeCurriculum} SET description = ?, updated_at = NOW() WHERE id = ?`;
		const result = (await query(sql, [description, existing.id])) as any;
		return result.affectedRows > 0;
	} else {
		const newId = crypto.randomUUID();
		const sql = `INSERT INTO ${tableObeCurriculum} (id, description) VALUES (?, ?)`;
		const result = (await query(sql, [newId, description])) as any;
		return result.affectedRows > 0;
	}
}
