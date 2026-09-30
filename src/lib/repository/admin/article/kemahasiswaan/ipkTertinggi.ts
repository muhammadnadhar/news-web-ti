import { query } from '$lib/database/svelteDb';
import type { HighGpaStudentDTO } from '$lib/dto/admin/article/kemahasiswaan';
import type { SemesterDTO } from '$lib/dto/admin/dataset';
import { tableHighGpaStudent } from '$lib/seeder/admin/article/kemahasiswaan';
import { tableAngkatan, tableSemester } from '$lib/seeder/admin/dataset';

/**
 * Mengambil seluruh data Mahasiswa IPK Tertinggi (dengan JOIN Angkatan & Semester)
 */
export async function getAllHighGpaStudents(): Promise<HighGpaStudentDTO[]> {
	const sql = `
        SELECT 
            h.id,
            h.student_name,
            h.gpa,
            h.angkatan_id,
            h.semester_id,
            h.image_url,
            h.image_public_id,
            h.created_at,
            h.updated_at,
            a.year AS batch_year,
            s.name AS semester_name
        FROM ${tableHighGpaStudent} h
        LEFT JOIN ${tableAngkatan} a ON h.angkatan_id = a.id
        LEFT JOIN ${tableSemester} s ON h.semester_id = s.id
        ORDER BY h.gpa DESC, h.created_at DESC
    `;
	return (await query(sql)) as HighGpaStudentDTO[];
}

/**
 * Mengambil daftar semester unik yang terdaftar pada data IPK Tertinggi
 */
export async function getHighGpaSemesters(): Promise<SemesterDTO[]> {
	const sql = `
        SELECT DISTINCT 
            s.id,
            s.name,
            s.academic_year,
            s.is_active,
            s.created_at,
            s.updated_at
        FROM ${tableHighGpaStudent} h
        INNER JOIN ${tableSemester} s ON h.semester_id = s.id
        ORDER BY s.created_at DESC
    `;
	return (await query(sql)) as SemesterDTO[];
}

/**
 * Mengambil 1 data Mahasiswa IPK Tertinggi berdasarkan ID
 */
export async function getHighGpaStudentById(id: string): Promise<HighGpaStudentDTO | null> {
	const sql = `
        SELECT 
            h.id,
            h.student_name,
            h.gpa,
            h.angkatan_id,
            h.semester_id,
            h.image_url,
            h.image_public_id,
            h.created_at,
            h.updated_at,
            a.year AS batch_year,
            s.name AS semester_name
        FROM ${tableHighGpaStudent} h
        LEFT JOIN ${tableAngkatan} a ON h.angkatan_id = a.id
        LEFT JOIN ${tableSemester} s ON h.semester_id = s.id
        WHERE h.id = ? 
        LIMIT 1
    `;
	const rows = (await query(sql, [id])) as HighGpaStudentDTO[];
	return rows[0] || null;
}

/**
 * Mengambil data Mahasiswa IPK Tertinggi berdasarkan semester_id
 */
export async function getHighGpaStudentsBySemesterId(
	semesterId: string
): Promise<HighGpaStudentDTO[]> {
	const sql = `
        SELECT 
            h.id,
            h.student_name,
            h.gpa,
            h.angkatan_id,
            h.semester_id,
            h.image_url,
            h.image_public_id,
            h.created_at,
            h.updated_at,
            a.year AS batch_year,
            s.name AS semester_name
        FROM ${tableHighGpaStudent} h
        LEFT JOIN ${tableAngkatan} a ON h.angkatan_id = a.id
        LEFT JOIN ${tableSemester} s ON h.semester_id = s.id
        WHERE h.semester_id = ?
        ORDER BY h.gpa DESC, h.created_at DESC
    `;
	return (await query(sql, [semesterId])) as HighGpaStudentDTO[];
}

/**
 * Mengambil data Mahasiswa IPK Tertinggi berdasarkan Nama Semester
 */
export async function getHighGpaStudentsBySemesterName(
	semesterName: string
): Promise<HighGpaStudentDTO[]> {
	const sql = `
        SELECT 
            h.id,
            h.student_name,
            h.gpa,
            h.angkatan_id,
            h.semester_id,
            h.image_url,
            h.image_public_id,
            h.created_at,
            h.updated_at,
            a.year AS batch_year,
            s.name AS semester_name
        FROM ${tableHighGpaStudent} h
        LEFT JOIN ${tableAngkatan} a ON h.angkatan_id = a.id
        LEFT JOIN ${tableSemester} s ON h.semester_id = s.id
        WHERE LOWER(s.name) = LOWER(?)
        ORDER BY h.gpa DESC, h.created_at DESC
    `;
	return (await query(sql, [semesterName])) as HighGpaStudentDTO[];
}

/**
 * Membuat data Mahasiswa IPK Tertinggi baru dengan Foreign Key
 */
export async function createHighGpaStudent(
	id: string,
	studentName: string,
	gpa: number,
	angkatanId: string,
	semesterId: string,
	imageUrl?: string | null,
	imagePublicId?: string | null
): Promise<boolean> {
	const sql = `
        INSERT INTO ${tableHighGpaStudent} (id, student_name, gpa, angkatan_id, semester_id, image_url, image_public_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
	const result = (await query(sql, [
		id,
		studentName,
		gpa,
		angkatanId,
		semesterId,
		imageUrl || null,
		imagePublicId || null
	])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Mahasiswa IPK Tertinggi berdasarkan Foreign Key
 */
export async function updateHighGpaStudent(
	id: string,
	studentName: string,
	gpa: number,
	angkatanId: string,
	semesterId: string,
	imageUrl?: string | null,
	imagePublicId?: string | null
): Promise<boolean> {
	const sql = `
        UPDATE ${tableHighGpaStudent} 
        SET 
            student_name = ?, 
            gpa = ?, 
            angkatan_id = ?, 
            semester_id = ?, 
            image_url = ?, 
            image_public_id = ?, 
            updated_at = NOW() 
        WHERE id = ?
    `;
	const result = (await query(sql, [
		studentName,
		gpa,
		angkatanId,
		semesterId,
		imageUrl || null,
		imagePublicId || null,
		id
	])) as any;
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
