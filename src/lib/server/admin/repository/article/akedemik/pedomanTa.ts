import { tablePedomanTa } from '$lib/seeder/admin/article/akademik';
import { query } from '$lib/server/database/svelteDb';
import type { PedomanTaDTO } from '$lib/types/admin/article/akademik';

/**
 * Mengambil seluruh data Pedoman TA
 */
export async function getAllPedomanTa(): Promise<PedomanTaDTO[]> {
	const sql = `SELECT * FROM ${tablePedomanTa} ORDER BY created_at ASC`;
	return (await query(sql)) as PedomanTaDTO[];
}

/**
 * Mengambil 1 data Pedoman TA berdasarkan ID
 */
export async function getPedomanTaById(id: string): Promise<PedomanTaDTO | null> {
	const sql = `SELECT * FROM ${tablePedomanTa} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as PedomanTaDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Pedoman TA baru
 */
export async function createPedomanTa(
	id: string,
	title: string,
	imageUrl: string | null,
	description: string | null
): Promise<boolean> {
	const sql = `INSERT INTO ${tablePedomanTa} (id, title, image_url, description) VALUES (?, ?, ?, ?)`;
	const result = (await query(sql, [id, title, imageUrl, description])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Pedoman TA
 */
export async function updatePedomanTa(
	id: string,
	title: string,
	imageUrl: string | null,
	description: string | null
): Promise<boolean> {
	let sql: string;
	let params: any[];

	if (imageUrl !== null) {
		sql = `UPDATE ${tablePedomanTa} SET title = ?, image_url = ?, description = ?, updated_at = NOW() WHERE id = ?`;
		params = [title, imageUrl, description, id];
	} else {
		sql = `UPDATE ${tablePedomanTa} SET title = ?, description = ?, updated_at = NOW() WHERE id = ?`;
		params = [title, description, id];
	}

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Pedoman TA
 */
export async function deletePedomanTa(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tablePedomanTa} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
