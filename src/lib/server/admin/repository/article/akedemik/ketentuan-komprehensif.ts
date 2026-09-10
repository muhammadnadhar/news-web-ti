import { tableRecruitment } from '$lib/seeder/admin/article/akademik';
import { query } from '$lib/server/database/runtimeDb';
import type { KetentuanKompreDTO } from '$lib/types/admin/article/akademik';
/**
 * Mengambil seluruh data Rekrutmen
 */
export async function getAllRecruitment(): Promise<KetentuanKompreDTO[]> {
	const sql = `SELECT * FROM ${tableRecruitment} ORDER BY created_at ASC`;
	return (await query(sql)) as KetentuanKompreDTO[];
}

/**
 * Mengambil 1 data Rekrutmen berdasarkan ID
 */
export async function getRecruitmentById(id: string): Promise<KetentuanKompreDTO | null> {
	const sql = `SELECT * FROM ${tableRecruitment} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as KetentuanKompreDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Rekrutmen baru
 */
export async function createRecruitment(
	id: string,
	title: string,
	imageUrl: string | null,
	description: string | null
): Promise<boolean> {
	const sql = `INSERT INTO ${tableRecruitment} (id, title, image_url, description) VALUES (?, ?, ?, ?)`;
	const result = (await query(sql, [id, title, imageUrl, description])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Rekrutmen
 */
export async function updateRecruitment(
	id: string,
	title: string,
	imageUrl: string | null,
	description: string | null
): Promise<boolean> {
	let sql: string;
	let params: any[];

	if (imageUrl !== null) {
		sql = `UPDATE ${tableRecruitment} SET title = ?, image_url = ?, description = ?, updated_at = NOW() WHERE id = ?`;
		params = [title, imageUrl, description, id];
	} else {
		sql = `UPDATE ${tableRecruitment} SET title = ?, description = ?, updated_at = NOW() WHERE id = ?`;
		params = [title, description, id];
	}

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Rekrutmen
 */
export async function deleteRecruitment(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableRecruitment} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
