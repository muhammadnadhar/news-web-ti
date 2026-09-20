import { query } from '$lib/database/svelteDb';
import type {
	CreateHistoryContentData,
	HistoryContentDTO,
	HistoryLeadersDTO
} from '$lib/dto/admin/article/profile';
import {
	tableLecturerStaff,
	tableSejarahContent,
	tableSejarahLeaders
} from '$lib/seeder/admin/article/profile';

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
 * --- repository pimpinan jurusan (periode) ---
 */
/** create basic history leader */
export async function createHistoryLeader(
	id: string,
	period: string,
	head_id: string | null = null,
	secretary_id: string | null = null
): Promise<boolean> {
	const sql = `INSERT INTO ${tableSejarahLeaders} (id, period, head_id, secretary_id) VALUES (?, ?, ?, ?)`;
	const result = (await query(sql, [id, period, head_id, secretary_id])) as any;
	return result.affectedRows > 0;
}

/** read all history leaders (with join to lecturer_staff) */
export async function getAllHistoryLeaders(): Promise<HistoryLeadersDTO[]> {
	const sql = `
        SELECT 
            hl.id,
            hl.period,
            hl.head_id,
            hl.secretary_id,
            hl.created_at,
            hl.updated_at,
            h.name AS head_name,
            h.photo_url AS head_photo,
            s.name AS secretary_name,
            s.photo_url AS secretary_photo
        FROM ${tableSejarahLeaders} hl
        LEFT JOIN ${tableLecturerStaff} h ON hl.head_id = h.id
        LEFT JOIN ${tableLecturerStaff} s ON hl.secretary_id = s.id
        ORDER BY hl.created_at DESC
    `;
	return (await query(sql)) as HistoryLeadersDTO[];
}

/** READ HISTORY LEADER BY ID (WITH JOIN TO LECTURER_STAFF) */
export async function getHistoryLeaderById(id: string): Promise<HistoryLeadersDTO | null> {
	const sql = `
        SELECT 
            hl.id,
            hl.period,
            hl.head_id,
            hl.secretary_id,
            hl.created_at,
            hl.updated_at,
            h.name AS head_name,
            h.photo_url AS head_photo,
            s.name AS secretary_name,
            s.photo_url AS secretary_photo
        FROM ${tableSejarahLeaders} hl
        LEFT JOIN ${tableLecturerStaff} h ON hl.head_id = h.id
        LEFT JOIN ${tableLecturerStaff} s ON hl.secretary_id = s.id
        WHERE hl.id = ? 
        LIMIT 1
    `;
	const rows = (await query(sql, [id])) as HistoryLeadersDTO[];
	return rows[0] || null;
}

/** CREATE / ADD HISTORY LEADER */
export async function addHistoryLeader(
	data: Omit<
		HistoryLeadersDTO,
		| 'id'
		| 'created_at'
		| 'updated_at'
		| 'head_name'
		| 'head_photo'
		| 'secretary_name'
		| 'secretary_photo'
		| 'head'
		| 'secretary'
	>
): Promise<string> {
	const id = crypto.randomUUID();
	const sql = `
        INSERT INTO ${tableSejarahLeaders} (
            id, 
            period, 
            head_id, 
            secretary_id
        )
        VALUES (?, ?, ?, ?)
    `;
	await query(sql, [id, data.period, data.head_id ?? null, data.secretary_id ?? null]);
	return id;
}

/** UPDATE HISTORY LEADER */
export async function updateHistoryLeader(
	id: string,
	data: Partial<
		Omit<
			HistoryLeadersDTO,
			| 'id'
			| 'created_at'
			| 'updated_at'
			| 'head_name'
			| 'head_photo'
			| 'secretary_name'
			| 'secretary_photo'
			| 'head'
			| 'secretary'
		>
	>
): Promise<boolean> {
	const fields: string[] = [];
	const values: any[] = [];

	if (data.period !== undefined) {
		fields.push('period = ?');
		values.push(data.period);
	}
	if (data.head_id !== undefined) {
		fields.push('head_id = ?');
		values.push(data.head_id);
	}
	if (data.secretary_id !== undefined) {
		fields.push('secretary_id = ?');
		values.push(data.secretary_id);
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
            head_id, 
            secretary_id
        )
        VALUES (?, ?, ?, ?)
    `;
	const result = (await query(sql, [
		data.id,
		data.period,
		data.head_id ?? null,
		data.secretary_id ?? null
	])) as any;
	return result.affectedRows > 0;
}

/** DELETE HISTORY LEADER */
export async function deleteHistoryLeader(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableSejarahLeaders} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
