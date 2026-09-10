import { tablePedomanKkp } from '$lib/seeder/admin/article/akademik';
import { query } from '$lib/server/database/runtimeDb';
import type { PedomanKkpDTO } from '$lib/types/admin/article/akademik';

/**
 * Mengambil seluruh data Pedoman KKP
 */
export async function getAllPedomanKkp(): Promise<PedomanKkpDTO[]> {
	const sql = `SELECT * FROM ${tablePedomanKkp} ORDER BY created_at ASC`;
	return (await query(sql)) as PedomanKkpDTO[];
}

/**
 * Mengambil 1 data Pedoman KKP berdasarkan ID
 */
export async function getPedomanKkpById(id: string): Promise<PedomanKkpDTO | null> {
	const sql = `SELECT * FROM ${tablePedomanKkp} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as PedomanKkpDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Pedoman KKP baru
 */
export async function createPedomanKkp(
	id: string,
	title: string,
	imageUrl: string | null,
	description: string | null
): Promise<boolean> {
	const sql = `INSERT INTO ${tablePedomanKkp} (id, title, image_url, description) VALUES (?, ?, ?, ?)`;
	const result = (await query(sql, [id, title, imageUrl, description])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Pedoman KKP
 */
export async function updatePedomanKkp(
	id: string,
	title: string,
	imageUrl: string | null,
	description: string | null
): Promise<boolean> {
	let sql: string;
	let params: any[];

	if (imageUrl !== null) {
		sql = `UPDATE ${tablePedomanKkp} SET title = ?, image_url = ?, description = ?, updated_at = NOW() WHERE id = ?`;
		params = [title, imageUrl, description, id];
	} else {
		sql = `UPDATE ${tablePedomanKkp} SET title = ?, description = ?, updated_at = NOW() WHERE id = ?`;
		params = [title, description, id];
	}

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Pedoman KKP
 */
export async function deletePedomanKkp(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tablePedomanKkp} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
