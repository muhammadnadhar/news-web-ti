import { query } from '$lib/database/svelteDb';
import type { LecturerPublicationDTO } from '$lib/dto/admin/article/penelitian';
import { tableLecturerPublication } from '$lib/seeder/admin/article/penelitian';

/**
 * Mengambil seluruh data Publikasi Dosen
 */
export async function getAllLecturerPublications(): Promise<LecturerPublicationDTO[]> {
	const sql = `SELECT * FROM ${tableLecturerPublication} ORDER BY created_at DESC`;
	return (await query(sql)) as LecturerPublicationDTO[];
}

/**
 * Mengambil 1 data Publikasi Dosen berdasarkan ID
 */
export async function getLecturerPublicationById(
	id: string
): Promise<LecturerPublicationDTO | null> {
	const sql = `SELECT * FROM ${tableLecturerPublication} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as LecturerPublicationDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Publikasi Dosen baru
 */
export async function createLecturerPublication(
	id: string,
	lecturerName: string,
	sintaLink: string | null,
	scholarLink: string | null
): Promise<boolean> {
	const sql = `INSERT INTO ${tableLecturerPublication} (id, lecturer_name, sinta_link, scholar_link) VALUES (?, ?, ?, ?)`;
	const result = (await query(sql, [
		id,
		lecturerName,
		sintaLink || null,
		scholarLink || null
	])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Publikasi Dosen
 */
export async function updateLecturerPublication(
	id: string,
	lecturerName: string,
	sintaLink: string | null,
	scholarLink: string | null
): Promise<boolean> {
	const sql = `UPDATE ${tableLecturerPublication} SET lecturer_name = ?, sinta_link = ?, scholar_link = ?, updated_at = NOW() WHERE id = ?`;
	const result = (await query(sql, [
		lecturerName,
		sintaLink || null,
		scholarLink || null,
		id
	])) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Publikasi Dosen
 */
export async function deleteLecturerPublication(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableLecturerPublication} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
