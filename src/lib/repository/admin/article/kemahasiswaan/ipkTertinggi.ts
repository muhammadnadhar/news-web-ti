import { query } from '$lib/database/svelteDb';
import type { HighGpaStudentDTO } from '$lib/dto/admin/article/kemahasiswaan';
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
export async function getHighGpaSemesters(): Promise<
	{ semester_id: string; semester_name: string }[]
> {
	const sql = `
		SELECT DISTINCT 
			s.id AS semester_id,
			s.name AS semester_name
		FROM ${tableHighGpaStudent} h
		INNER JOIN ${tableSemester} s ON h.semester_id = s.id
		ORDER BY s.created_at DESC
	`;
	return (await query(sql)) as { semester_id: string; semester_name: string }[];
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
      h.image_url,
			h.semester_id,
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
 * Membuat data Mahasiswa IPK Tertinggi baru dengan Foreign Key
 */
export async function createHighGpaStudent(
	id: string,
	studentName: string,
	gpa: number,
	angkatanId: string,
	semesterId: string,
	image_url: string
): Promise<boolean> {
	const sql = `
		INSERT INTO ${tableHighGpaStudent} (id, student_name, gpa, angkatan_id, semester_id, image_url) 
		VALUES (?, ?, ?, ?, ?,? )
	`;
	const result = (await query(sql, [
		id,
		studentName,
		gpa,
		angkatanId,
		semesterId,
		image_url
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
	image_url?: string | null
): Promise<boolean> {
	const sql = `
		UPDATE ${tableHighGpaStudent} 
		SET 
			student_name = ?, 
			gpa = ?, 
			angkatan_id = ?, 
			semester_id = ?, 
      image_url = ?,
			updated_at = NOW() 
		WHERE id = ?
	`;
	const result = (await query(sql, [
		studentName,
		gpa,
		angkatanId,
		semesterId,
		image_url || null,
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
