import { randomUUID } from '$lib/crypto';
import { query } from '$lib/database/svelteDb';
import type { PerminatanTIItemDTO } from '$lib/dto/admin/home';
import { tablePerminatanTI } from '$lib/seeder/admin/home';

/** read all perminatan ti */
export async function getAllPerminatanTI(): Promise<PerminatanTIItemDTO[]> {
	const sql = `SELECT * FROM ${tablePerminatanTI} ORDER BY title ASC`;
	return (await query(sql)) as PerminatanTIItemDTO[];
}

/** read perminatan ti by id */
export async function getPerminatanTIById(id: string): Promise<PerminatanTIItemDTO | null> {
	const sql = `SELECT * FROM ${tablePerminatanTI} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as PerminatanTIItemDTO[];
	return rows.length > 0 ? rows[0] : null;
}

/** create / add perminatan ti */
export async function addPerminatanTI(
	data: Omit<PerminatanTIItemDTO, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
	const id = randomUUID();
	const sql = `
		INSERT INTO ${tablePerminatanTI} (id, title, description)
		VALUES (?, ?, ?)
	`;
	await query(sql, [id, data.title, data.description]);
	return id;
}

/** update perminatan ti */
export async function updatePerminatanTI(
	id: string,
	data: Partial<Omit<PerminatanTIItemDTO, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
	const fields: string[] = [];
	const values: any[] = [];

	if (data.title !== undefined) {
		fields.push('title = ?');
		values.push(data.title);
	}
	if (data.description !== undefined) {
		fields.push('description = ?');
		values.push(data.description);
	}

	if (fields.length === 0) return false;

	values.push(id);
	const sql = `UPDATE ${tablePerminatanTI} SET ${fields.join(', ')} WHERE id = ?`;
	const result = (await query(sql, values)) as any;
	return result.affectedRows > 0;
}

/** replace perminatan ti (upsert full data) */
export async function replacePerminatanTI(data: PerminatanTIItemDTO): Promise<boolean> {
	const sql = `
		REPLACE INTO ${tablePerminatanTI} (id, title, description)
		VALUES (?, ?, ?)
	`;
	const result = (await query(sql, [data.id, data.title, data.description])) as any;
	return result.affectedRows > 0;
}

/** delete perminatan ti */
export async function deletePerminatanTI(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tablePerminatanTI} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
