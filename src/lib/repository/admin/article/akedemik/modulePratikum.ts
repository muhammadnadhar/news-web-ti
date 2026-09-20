import { query } from '$lib/database/svelteDb';
import type { PracticumModuleDTO } from '$lib/dto/admin/article/akademik';
import { tablePracticumModule } from '$lib/seeder/admin/article/akademik';

/**
 * Mengambil seluruh data Modul Praktikum
 */
export async function getAllPracticumModule(): Promise<PracticumModuleDTO[]> {
	const sql = `SELECT * FROM ${tablePracticumModule} ORDER BY created_at ASC`;
	return (await query(sql)) as PracticumModuleDTO[];
}

/**
 * Mengambil 1 data Modul Praktikum berdasarkan ID
 */
export async function getPracticumModuleById(id: string): Promise<PracticumModuleDTO | null> {
	const sql = `SELECT * FROM ${tablePracticumModule} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as PracticumModuleDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Modul Praktikum baru
 */
export async function createPracticumModule(
	id: string,
	title: string,
	imageUrl: string | null,
	description: string | null
): Promise<boolean> {
	const sql = `INSERT INTO ${tablePracticumModule} (id, title, image_url, description) VALUES (?, ?, ?, ?)`;
	const result = (await query(sql, [id, title, imageUrl, description])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Modul Praktikum
 */
export async function updatePracticumModule(
	id: string,
	title: string,
	imageUrl: string | null,
	description: string | null
): Promise<boolean> {
	let sql: string;
	let params: any[];

	if (imageUrl !== null) {
		sql = `UPDATE ${tablePracticumModule} SET title = ?, image_url = ?, description = ?, updated_at = NOW() WHERE id = ?`;
		params = [title, imageUrl, description, id];
	} else {
		sql = `UPDATE ${tablePracticumModule} SET title = ?, description = ?, updated_at = NOW() WHERE id = ?`;
		params = [title, description, id];
	}

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Modul Praktikum
 */
export async function deletePracticumModule(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tablePracticumModule} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
