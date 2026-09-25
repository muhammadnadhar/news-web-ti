import { query } from '$lib/database/svelteDb';
import type { StudentAchievementDTO } from '$lib/dto/admin/article/kemahasiswaan';
import type { SemesterDTO } from '$lib/dto/admin/dataset';
import { tableStudentAchievement } from '$lib/seeder/admin/article/kemahasiswaan';
import { tableAngkatan, tableSemester } from '$lib/seeder/admin/dataset';

//
// Mapress  : Mahasiswa Prestasi
//
/**
 * Mengambil seluruh data Mahasiswa Prestasi (Lengkap dengan detail Angkatan & Semester)
 */
export async function getAllStudentAchievements(): Promise<StudentAchievementDTO[]> {
	const sql = `
		SELECT 
			sa.*,
			a.year AS batch_year,
			s.name AS semester_name,
			s.academic_year AS academic_year
		FROM ${tableStudentAchievement} sa
		LEFT JOIN ${tableAngkatan} a ON sa.angkatan_id = a.id
		LEFT JOIN ${tableSemester} s ON sa.semester_id = s.id
		ORDER BY sa.created_at DESC
	`;
	return (await query(sql)) as StudentAchievementDTO[];
}

/**
 * Mengambil semester unik berdasarkan jenis prestasi (Akademik / Non-Akademik)
 */
export async function getAchievementSemesters(
	isAcademic: 'y' | 'n'
): Promise<SemesterDTO[]> {
	const sql = `
		SELECT DISTINCT 
			s.id,
			s.name,
			s.academic_year,
			s.is_active,
			s.created_at,
			s.updated_at
		FROM ${tableStudentAchievement} sa
		INNER JOIN ${tableSemester} s ON sa.semester_id = s.id
		WHERE sa.is_academic = ?
		ORDER BY s.academic_year DESC, s.name DESC
	`;
	return (await query(sql, [isAcademic])) as SemesterDTO[];
}

/**
 * Mengambil 1 data Mahasiswa Prestasi berdasarkan ID (Lengkap dengan JOIN)
 */
export async function getStudentAchievementById(
	id: string
): Promise<StudentAchievementDTO | null> {
	const sql = `
		SELECT 
			sa.*,
			a.year AS batch_year,
			s.name AS semester_name,
			s.academic_year AS academic_year
		FROM ${tableStudentAchievement} sa
		LEFT JOIN ${tableAngkatan} a ON sa.angkatan_id = a.id
		LEFT JOIN ${tableSemester} s ON sa.semester_id = s.id
		WHERE sa.id = ?
		LIMIT 1
	`;
	const rows = (await query(sql, [id])) as StudentAchievementDTO[];
	return rows[0] || null;
}

/**
 * Mengambil seluruh data semester unik yang memiliki data prestasi
 */
export async function getDistinctSemesters(): Promise<SemesterDTO[]> {
	const sql = `
		SELECT DISTINCT 
			s.id,
			s.name,
			s.academic_year,
			s.is_active,
			s.created_at,
			s.updated_at
		FROM ${tableStudentAchievement} sa
		INNER JOIN ${tableSemester} s ON sa.semester_id = s.id
		ORDER BY s.academic_year DESC, s.name DESC
	`;
	return (await query(sql)) as SemesterDTO[];
}

/**
 * Mengambil data Mahasiswa Prestasi berdasarkan semester_id (ID dari SemesterDTO)
 * Opsional: Dapat difilter juga berdasarkan jenis prestasi ('y' untuk Akademik, 'n' untuk Non-Akademik)
 */
export async function getStudentAchievementsBySemesterId(
	semesterId: string,
	isAcademic?: 'y' | 'n'
): Promise<StudentAchievementDTO[]> {
	let sql = `
        SELECT 
            sa.*,
            a.year AS batch_year,
            s.name AS semester_name,
            s.academic_year AS academic_year
        FROM ${tableStudentAchievement} sa
        LEFT JOIN ${tableAngkatan} a ON sa.angkatan_id = a.id
        LEFT JOIN ${tableSemester} s ON sa.semester_id = s.id
        WHERE sa.semester_id = ?
    `;

	const params: any[] = [semesterId];

	if (isAcademic) {
		sql += ` AND sa.is_academic = ?`;
		params.push(isAcademic);
	}

	sql += ` ORDER BY sa.created_at DESC`;

	return (await query(sql, params)) as StudentAchievementDTO[];
}

/**
 * Mengambil data Mahasiswa Prestasi berdasarkan Nama Semester (misal dari Query URL parameter)
 * Sangat berguna jika URL navbar Anda menggunakan nama semester seperti ?semester=Semester%20Ganjil%202020/2030
 */
export async function getStudentAchievementsBySemesterName(
	semesterName: string,
	isAcademic?: 'y' | 'n'
): Promise<StudentAchievementDTO[]> {
	let sql = `
        SELECT 
            sa.*,
            a.year AS batch_year,
            s.name AS semester_name,
            s.academic_year AS academic_year
        FROM ${tableStudentAchievement} sa
        LEFT JOIN ${tableAngkatan} a ON sa.angkatan_id = a.id
        LEFT JOIN ${tableSemester} s ON sa.semester_id = s.id
        WHERE LOWER(s.name) = LOWER(?)
    `;

	const params: any[] = [semesterName];

	if (isAcademic) {
		sql += ` AND sa.is_academic = ?`;
		params.push(isAcademic);
	}

	sql += ` ORDER BY sa.created_at DESC`;

	return (await query(sql, params)) as StudentAchievementDTO[];
}

/**
 * Membuat data Mahasiswa Prestasi baru
 */
export async function createStudentAchievement(
	id: string,
	studentName: string,
	isAcademic: 'y' | 'n',
	angkatanId: string,
	semesterId: string,
	achievementName: string,
	imageUrl: string | null
): Promise<boolean> {
	const sql = `
		INSERT INTO ${tableStudentAchievement} (
			id, 
			student_name, 
			is_academic, 
			angkatan_id, 
			semester_id, 
			achievement_name, 
			image_url
		) VALUES (?, ?, ?, ?, ?, ?, ?)
	`;
	const result = (await query(sql, [
		id,
		studentName,
		isAcademic,
		angkatanId,
		semesterId,
		achievementName,
		imageUrl
	])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Mahasiswa Prestasi
 */
export async function updateStudentAchievement(
	id: string,
	studentName: string,
	isAcademic: 'y' | 'n',
	angkatanId: string,
	semesterId: string,
	achievementName: string,
	imageUrl: string | null
): Promise<boolean> {
	const sql = `
		UPDATE ${tableStudentAchievement} 
		SET 
			student_name = ?, 
			is_academic = ?, 
			angkatan_id = ?, 
			semester_id = ?, 
			achievement_name = ?, 
			image_url = ?, 
			updated_at = NOW() 
		WHERE id = ?
	`;
	const result = (await query(sql, [
		studentName,
		isAcademic,
		angkatanId,
		semesterId,
		achievementName,
		imageUrl,
		id
	])) as any;
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
