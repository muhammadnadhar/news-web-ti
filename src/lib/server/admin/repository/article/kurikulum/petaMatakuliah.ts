import { tableCourseMap } from '$lib/seeder/admin/article/kurikulum';
import { query } from '$lib/server/database/runtimeDb';
import type { CourseMapDTO } from '$lib/types/admin/article/kurikulum';

/**
 * Mengambil seluruh data Peta Mata Kuliah
 */
export async function getAllCourseMap(): Promise<CourseMapDTO[]> {
	const sql = `SELECT * FROM ${tableCourseMap} ORDER BY created_at ASC`;
	return (await query(sql)) as CourseMapDTO[];
}

/**
 * Mengambil 1 data Peta Mata Kuliah berdasarkan ID
 */
export async function getCourseMapById(id: string): Promise<CourseMapDTO | null> {
	const sql = `SELECT * FROM ${tableCourseMap} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as CourseMapDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Peta Mata Kuliah baru
 */
export async function createCourseMap(
	id: string,
	title: string,
	imageUrl: string
): Promise<boolean> {
	const sql = `INSERT INTO ${tableCourseMap} (id, title, image_url) VALUES (?, ?, ?)`;
	const result = (await query(sql, [id, title, imageUrl])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Peta Mata Kuliah
 */
export async function updateCourseMap(
	id: string,
	title: string,
	imageUrl: string | null
): Promise<boolean> {
	let sql: string;
	let params: any[];

	if (imageUrl) {
		sql = `UPDATE ${tableCourseMap} SET title = ?, image_url = ?, updated_at = NOW() WHERE id = ?`;
		params = [title, imageUrl, id];
	} else {
		sql = `UPDATE ${tableCourseMap} SET title = ?, updated_at = NOW() WHERE id = ?`;
		params = [title, id];
	}

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Peta Mata Kuliah
 */
export async function deleteCourseMap(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableCourseMap} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
