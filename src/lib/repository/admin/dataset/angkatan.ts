import { query } from '$lib/database/svelteDb';
import type { AngkatanDTO } from '$lib/dto/admin/dataset';
import { tableAngkatan } from '$lib/seeder/admin/dataset';



/**
 *  tambah angkatan (create)
 */
export async function createAngkatan(id: string, year: number): Promise<boolean> {
	const sql = `INSERT INTO ${tableAngkatan} (id, year) VALUES (?, ?)`;
	const result = (await query(sql, [id, year])) as any;
	return result.affectedRows > 0;
}

/**
 * mendapatkan semua angkatan (read all)
 */
export async function getAllAngkatan(): Promise<AngkatanDTO[]> {
	const sql = `SELECT * FROM ${tableAngkatan} ORDER BY year DESC`;
	const rows = (await query(sql)) as AngkatanDTO[];
	return rows;
}

export async function getAngkatanById(id: string): Promise<AngkatanDTO | null> {
	const sql = `SELECT id, year, created_at, updated_at FROM ${tableAngkatan} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as AngkatanDTO[];
	return rows[0] || null;
}

export async function getAngkatanByYear(year: number): Promise<AngkatanDTO | null> {
	const sql = `SELECT id, year, created_at, updated_at FROM ${tableAngkatan} WHERE year = ? LIMIT 1`;
	const rows = (await query(sql, [year])) as AngkatanDTO[];
	return rows[0] || null;
}

/**
 * 3. UPDATE ANGKATAN (Update)
 */
export async function updateAngkatan(id: string, year: number): Promise<boolean> {
	const sql = `UPDATE ${tableAngkatan} SET year = ? WHERE id = ?`;
	const result = (await query(sql, [year, id])) as any;
	return result.affectedRows > 0;
}

/**
 * 4. HAPUS ANGKATAN (Delete)
 */
export async function deleteAngkatan(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableAngkatan} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
