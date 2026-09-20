import { query } from '$lib/database/svelteDb';
import type { StudentPublicationDTO } from '$lib/dto/admin/article/penelitian';
import { tableStudentPublication } from '$lib/seeder/admin/article/penelitian';

/**
 * Mengambil seluruh data Publikasi Mahasiswa
 */
export async function getAllStudentPublications(): Promise<StudentPublicationDTO[]> {
	const sql = `SELECT * FROM ${tableStudentPublication} ORDER BY created_at DESC`;
	return (await query(sql)) as StudentPublicationDTO[];
}

/**
 * Mengambil 1 data Publikasi Mahasiswa berdasarkan ID
 */
export async function getstudentpublicationbyid(id: string): Promise<StudentPublicationDTO | null> {
	const sql = `SELECT * FROM ${tableStudentPublication} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as StudentPublicationDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Publikasi Mahasiswa baru
 */
export async function createStudentPublication(
	id: string,
	studentName: string,
	journalList: string
): Promise<boolean> {
	const sql = `INSERT INTO ${tableStudentPublication} (id, student_name, journal_list) VALUES (?, ?, ?)`;
	const result = (await query(sql, [id, studentName, journalList])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Publikasi Mahasiswa
 */
export async function updateStudentPublication(
	id: string,
	studentName: string,
	journalList: string
): Promise<boolean> {
	const sql = `UPDATE ${tableStudentPublication} SET student_name = ?, journal_list = ?, updated_at = NOW() WHERE id = ?`;
	const result = (await query(sql, [studentName, journalList, id])) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Publikasi Mahasiswa
 */
export async function deleteStudentPublication(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableStudentPublication} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
