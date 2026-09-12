import { tableVisiMisi } from '$lib/seeder/admin/article/profile';
import { query } from '$lib/server/database/svelteDb';
import type { CreateVisiMisiData, VisiMisiItemDTO } from '$lib/types/admin/article/profile';

/**
 * 1. MENDAPATKAN DATA VISI MISI (Read Singleton)
 */
export async function getVisiMisi(): Promise<VisiMisiItemDTO | null> {
	const sql = `SELECT * FROM ${tableVisiMisi} ORDER BY created_at ASC LIMIT 1`;
	const rows = (await query(sql)) as VisiMisiItemDTO[];
	if (!rows || rows.length === 0) return null;
	return rows[0];
}

/**
 * 2. tambah / update data visi misi (upsert)
 */
export async function upsertVisiMisi(id: string, data: CreateVisiMisiData): Promise<boolean> {
	const sql = `
		INSERT INTO ${tableVisiMisi} (id, content)
		VALUES (?, ?)
		ON DUPLICATE KEY UPDATE
			content = VALUES(content),
			updated_at = CURRENT_TIMESTAMP
	`;
	const params = [id, data.content];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}
