import { tableDosen, tablePerminatanTI, tableProfilProdi } from '$lib/seeder/admin/home';
import { query } from '$lib/server/database/svelteDb';
import type { DosenItemDTO } from '$lib/types/admin/home';


/** READ ALL DOSEN */
export async function getAllDosen(): Promise<DosenItemDTO[]> {
	const sql = `SELECT * FROM ${tableDosen} ORDER BY name ASC`;
	return (await query(sql)) as DosenItemDTO[];
}

/** READ DOSEN BY ID */
export async function getDosenById(id: string): Promise<DosenItemDTO | null> {
	const sql = `SELECT * FROM ${tableDosen} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as DosenItemDTO[];
	return rows.length > 0 ? rows[0] : null;
}

/** CREATE / ADD DOSEN */
export async function addDosen(data: Omit<DosenItemDTO, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
	const id = crypto.randomUUID();
	const sql = `
		INSERT INTO ${tableDosen} (id, name, position, image_url)
		VALUES (?, ?, ?, ?)
	`;
	await query(sql, [id, data.name, data.position, data.image_url]);
	return id;
}

/** UPDATE DOSEN (PARTIAL / SPECIFIC FIELDS) */
export async function updateDosen(id: string, data: Partial<Omit<DosenItemDTO, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
	const fields: string[] = [];
	const values: any[] = [];

	if (data.name !== undefined) {
		fields.push('name = ?');
		values.push(data.name);
	}
	if (data.position !== undefined) {
		fields.push('position = ?');
		values.push(data.position);
	}
	if (data.image_url !== undefined) {
		fields.push('image_url = ?');
		values.push(data.image_url);
	}

	if (fields.length === 0) return false;

	values.push(id);
	const sql = `UPDATE ${tableDosen} SET ${fields.join(', ')} WHERE id = ?`;
	const result = (await query(sql, values)) as any;
	return result.affectedRows > 0;
}

/** REPLACE DOSEN (REPLACE INTO / UPSERT FULL DATA) */
export async function replaceDosen(data: DosenItemDTO): Promise<boolean> {
	const sql = `
		REPLACE INTO ${tableDosen} (id, name, position, image_url)
		VALUES (?, ?, ?, ?)
	`;
	const result = (await query(sql, [data.id, data.name, data.position, data.image_url])) as any;
	return result.affectedRows > 0;
}

/** DELETE DOSEN */
export async function deleteDosen(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableDosen} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
