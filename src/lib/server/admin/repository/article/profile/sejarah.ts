import { tableSejarahContent, tableSejarahLeaders } from '$lib/seeder/admin/article/profile';
import { query } from '$lib/server/database/svelteDb';
import type {
	CreateHistoryContentData,
	HistoryContentDTO,
	HistoryLeaderDTO
} from '$lib/types/admin/article/profile';

/**
 * --- REPOSITORY KONTEN SEJARAH (SINGLETON) ---
 */
export async function getHistoryContent(): Promise<HistoryContentDTO | null> {
	const sql = `SELECT * FROM ${tableSejarahContent} ORDER BY created_at ASC LIMIT 1`;
	const rows = (await query(sql)) as HistoryContentDTO[];
	if (!rows || rows.length === 0) return null;
	return rows[0];
}

export async function upsertHistoryContent(
	id: string,
	data: CreateHistoryContentData
): Promise<boolean> {
	const sql = `
		INSERT INTO ${tableSejarahContent} (id, title, image_url, description)
		VALUES (?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
			title = VALUES(title),
			image_url = VALUES(image_url),
			description = VALUES(description),
			updated_at = CURRENT_TIMESTAMP
	`;
	const params = [id, data.title, data.image_url || null, data.description || null];
	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * --- REPOSITORY PIMPINAN JURUSAN (PERIODE) ---
 */
export async function getAllHistoryLeaders(): Promise<HistoryLeaderDTO[]> {
	const sql = `SELECT * FROM ${tableSejarahLeaders} ORDER BY created_at DESC`;
	const rows = (await query(sql)) as HistoryLeaderDTO[];
	return rows;
}

export async function createHistoryLeader(id: string, period: string): Promise<boolean> {
	const sql = `INSERT INTO ${tableSejarahLeaders} (id, period) VALUES (?, ?)`;
	const result = (await query(sql, [id, period])) as any;
	return result.affectedRows > 0;
}

export async function updateHistoryLeader(id: string, period: string): Promise<boolean> {
	const sql = `UPDATE ${tableSejarahLeaders} SET period = ? WHERE id = ?`;
	const result = (await query(sql, [period, id])) as any;
	return result.affectedRows > 0;
}

export async function deleteHistoryLeader(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableSejarahLeaders} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
