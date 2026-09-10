import { tableHighGpaStudent } from '$lib/seeder/admin/article/kemahasiswaan';
import { query } from '$lib/server/database/runtimeDb';
import type { HighGpaStudentDTO } from '$lib/types/admin/article/kemahasiswaan';

/**
 * Mengambil seluruh data Mahasiswa IPK Tertinggi
 */
export async function getAllHighGpaStudents(): Promise<HighGpaStudentDTO[]> {
	const sql = `SELECT * FROM ${tableHighGpaStudent} ORDER BY gpa DESC, created_at DESC`;
	return (await query(sql)) as HighGpaStudentDTO[];
}

/**
 * Mengambil 1 data Mahasiswa IPK Tertinggi berdasarkan ID
 */
export async function getHighGpaStudentById(id: string): Promise<HighGpaStudentDTO | null> {
	const sql = `SELECT * FROM ${tableHighGpaStudent} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as HighGpaStudentDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Mahasiswa IPK Tertinggi baru
 */
export async function createHighGpaStudent(
	id: string,
	studentName: string,
	gpa: number,
	batchYear: string,
	semester: string
): Promise<boolean> {
	const sql = `INSERT INTO ${tableHighGpaStudent} (id, student_name, gpa, batch_year, semester) VALUES (?, ?, ?, ?, ?)`;
	const result = (await query(sql, [id, studentName, gpa, batchYear, semester])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Mahasiswa IPK Tertinggi
 */
export async function updateHighGpaStudent(
	id: string,
	studentName: string,
	gpa: number,
	batchYear: string,
	semester: string
): Promise<boolean> {
	const sql = `UPDATE ${tableHighGpaStudent} SET student_name = ?, gpa = ?, batch_year = ?, semester = ?, updated_at = NOW() WHERE id = ?`;
	const result = (await query(sql, [studentName, gpa, batchYear, semester, id])) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Mahasiswa IPK Tertinggi
 */
export async function deleteHighGpaStudent(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableHighGpaStudent} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
