import { tableAngkatan } from '$lib/seeder/admin/dataset';

import { query } from '$lib/server/database/svelteDb';

import type { AngkatanDTO } from '$lib/types/admin/dataset';

/**
 * 1. TAMBAH ANGKATAN (Create)
 */
export async function createAngkatan(id: string, year: number): Promise<boolean> {
	const sql = `INSERT INTO ${tableAngkatan} (id, year) VALUES (?, ?)`;
	const result = (await query(sql, [id, year])) as any;
	return result.affectedRows > 0;
}

/**
 * 2. MENDAPATKAN SEMUA ANGKATAN (Read All)
 */
export async function getAllAngkatan(): Promise<AngkatanDTO[]> {
	const sql = `SELECT * FROM ${tableAngkatan} ORDER BY year DESC`;
	const rows = (await query(sql)) as AngkatanDTO[];
	return rows;
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
