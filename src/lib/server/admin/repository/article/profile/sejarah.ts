import { tableSejarahContent, tableSejarahLeaders } from '$lib/seeder/admin/article/profile';
import { query } from '$lib/server/database/svelteDb';
import type {
	CreateHistoryContentData,
	HistoryContentDTO,
	HistoryLeadersDTO
} from '$lib/types/admin/article/profile';

/**
 * --- repository konten sejarah (singleton) ---
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


export async function createHistoryLeader(id: string, period: string): Promise<boolean> {
	const sql = `INSERT INTO ${tableSejarahLeaders} (id, period) VALUES (?, ?)`;
	const result = (await query(sql, [id, period])) as any;
	return result.affectedRows > 0;
}



/** READ ALL HISTORY LEADERS */
export async function getAllHistoryLeaders(): Promise<HistoryLeadersDTO[]> {
	const sql = `SELECT * FROM ${tableSejarahLeaders} ORDER BY created_at DESC`;
	return (await query(sql)) as HistoryLeadersDTO[];
}

/** READ HISTORY LEADER BY ID */
export async function getHistoryLeaderById(id: string): Promise<HistoryLeadersDTO | null> {
	const sql = `SELECT * FROM ${tableSejarahLeaders} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as HistoryLeadersDTO[];
	return rows[0] || null;
}

/** CREATE / ADD HISTORY LEADER */
export async function addHistoryLeader(data: Omit<HistoryLeadersDTO, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
	const id = crypto.randomUUID();
	const sql = `
		INSERT INTO ${tableSejarahLeaders} (
			id, 
			period, 
			head_name, 
			head_photo, 
			secretary_name, 
			secretary_photo
		)
		VALUES (?, ?, ?, ?, ?, ?)
	`;
	await query(sql, [
		id,
		data.period,
		data.head_name,
		data.head_photo ?? null,
		data.secretary_name,
		data.secretary_photo ?? null
	]);
	return id;
}

/** UPDATE HISTORY LEADER */
export async function updateHistoryLeader(
	id: string,
	data: Partial<Omit<HistoryLeadersDTO, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
	const fields: string[] = [];
	const values: any[] = [];

	if (data.period !== undefined) {
		fields.push('period = ?');
		values.push(data.period);
	}
	if (data.head_name !== undefined) {
		fields.push('head_name = ?');
		values.push(data.head_name);
	}
	if (data.head_photo !== undefined) {
		fields.push('head_photo = ?');
		values.push(data.head_photo);
	}
	if (data.secretary_name !== undefined) {
		fields.push('secretary_name = ?');
		values.push(data.secretary_name);
	}
	if (data.secretary_photo !== undefined) {
		fields.push('secretary_photo = ?');
		values.push(data.secretary_photo);
	}

	if (fields.length === 0) return false;

	values.push(id);
	const sql = `UPDATE ${tableSejarahLeaders} SET ${fields.join(', ')} WHERE id = ?`;
	const result = (await query(sql, values)) as any;
	return result.affectedRows > 0;
}

/** REPLACE HISTORY LEADER (UPSERT FULL DATA) */
export async function replaceHistoryLeader(data: HistoryLeadersDTO): Promise<boolean> {
	const sql = `
		REPLACE INTO ${tableSejarahLeaders} (
			id, 
			period, 
			head_name, 
			head_photo, 
			secretary_name, 
			secretary_photo
		)
		VALUES (?, ?, ?, ?, ?, ?)
	`;
	const result = (await query(sql, [
		data.id,
		data.period,
		data.head_name,
		data.head_photo ?? null,
		data.secretary_name,
		data.secretary_photo ?? null
	])) as any;
	return result.affectedRows > 0;
}

/** DELETE HISTORY LEADER */
export async function deleteHistoryLeader(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableSejarahLeaders} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
