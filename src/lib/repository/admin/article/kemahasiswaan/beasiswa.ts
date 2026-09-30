import { query } from '$lib/database/svelteDb';
import type { ScholarshipDTO } from '$lib/dto/admin/article/kemahasiswaan';
import { tableScholarship } from '$lib/seeder/admin/article/kemahasiswaan';

/**
 * Mengambil seluruh data Beasiswa
 */
export async function getAllScholarships(): Promise<ScholarshipDTO[]> {
	const sql = `SELECT * FROM ${tableScholarship} ORDER BY created_at DESC`;
	return (await query(sql)) as ScholarshipDTO[];
}

/**
 * Mengambil 1 data Beasiswa berdasarkan ID
 */
export async function getScholarshipById(id: string): Promise<ScholarshipDTO | null> {
	const sql = `SELECT * FROM ${tableScholarship} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as ScholarshipDTO[];
	return rows[0] || null;
}

/**
 * Mengambil hanya image_public_id dari data Beasiswa berdasarkan ID
 * Query ini jauh lebih ringan karena tidak melakukan SELECT *
 */
export async function getScholarshipPublicImageIdyId(
	id: string
): Promise<{ image_public_id: string | null } | null> {
	const sql = `SELECT image_public_id FROM ${tableScholarship} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as Array<{ image_public_id: string | null }>;
	return rows[0] || null;
}

/**
 * Membuat data Beasiswa baru
 */
export async function createScholarship(
	id: string,
	studentName: string,
	scholarshipName: string,
	imageUrl: string | null,
	imagePublicId: string | null = null
): Promise<boolean> {
	const sql = `
        INSERT INTO ${tableScholarship} (id, student_name, scholarship_name, image_url, image_public_id) 
        VALUES (?, ?, ?, ?, ?)
    `;
	const result = (await query(sql, [
		id,
		studentName,
		scholarshipName,
		imageUrl,
		imagePublicId
	])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Beasiswa
 */
export async function updateScholarship(
	id: string,
	studentName: string,
	scholarshipName: string,
	imageUrl: string | null,
	imagePublicId: string | null = null
): Promise<boolean> {
	const sql = `
        UPDATE ${tableScholarship} 
        SET student_name = ?, scholarship_name = ?, image_url = ?, image_public_id = ?, updated_at = NOW() 
        WHERE id = ?
    `;
	const result = (await query(sql, [
		studentName,
		scholarshipName,
		imageUrl,
		imagePublicId,
		id
	])) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Beasiswa
 */
export async function deleteScholarship(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableScholarship} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
