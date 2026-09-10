import { tableStudentAchievement } from '$lib/seeder/admin/article/kemahasiswaan';
import { query } from '$lib/server/database/runtimeDb';
import type { StudentAchievementDTO } from '$lib/types/admin/article/kemahasiswaan';


/**
 * Mengambil seluruh data Mahasiswa Prestasi
 */
export async function getAllStudentAchievements(): Promise<StudentAchievementDTO[]> {
	const sql = `SELECT * FROM ${tableStudentAchievement} ORDER BY created_at DESC`;
	return (await query(sql)) as StudentAchievementDTO[];
}

/**
 * Mengambil 1 data Mahasiswa Prestasi berdasarkan ID
 */
export async function getStudentAchievementById(id: string): Promise<StudentAchievementDTO | null> {
	const sql = `SELECT * FROM ${tableStudentAchievement} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as StudentAchievementDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Mahasiswa Prestasi baru
 */
export async function createStudentAchievement(
	id: string,
	studentName: string,
	isAcademic: 'y' | 'n',
	batchYear: string,
	semester: string,
	achievementName: string
): Promise<boolean> {
	const sql = `INSERT INTO ${tableStudentAchievement} (id, student_name, is_academic, batch_year, semester, achievement_name) VALUES (?, ?, ?, ?, ?, ?)`;
	const result = (await query(sql, [id, studentName, isAcademic, batchYear, semester, achievementName])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Mahasiswa Prestasi
 */
export async function updateStudentAchievement(
	id: string,
	studentName: string,
	isAcademic: 'y' | 'n',
	batchYear: string,
	semester: string,
	achievementName: string
): Promise<boolean> {
	const sql = `UPDATE ${tableStudentAchievement} SET student_name = ?, is_academic = ?, batch_year = ?, semester = ?, achievement_name = ?, updated_at = NOW() WHERE id = ?`;
	const result = (await query(sql, [studentName, isAcademic, batchYear, semester, achievementName, id])) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Mahasiswa Prestasi
 */
export async function deleteStudentAchievement(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableStudentAchievement} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
