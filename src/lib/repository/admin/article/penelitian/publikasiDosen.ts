import { query } from '$lib/database/svelteDb';
import type { LecturerPublicationDTO } from '$lib/dto/admin/article/penelitian';
import { tableLecturerPublication } from '$lib/seeder/admin/article/penelitian';
import { tableLecturerStaff } from '$lib/seeder/admin/article/profile';

/**
 * Mengambil seluruh data Publikasi Dosen (dilengkapi nama & NIDN dosen dari JOIN)
 */
export async function getAllLecturerPublications(): Promise<LecturerPublicationDTO[]> {
	const sql = `
		SELECT 
			p.id,
			p.lecturer_id,
			l.name AS lecturer_name,
			l.nidn,
			p.sinta_link,
			p.scholar_link,
			p.created_at,
			p.updated_at
		FROM ${tableLecturerPublication} p
		LEFT JOIN ${tableLecturerStaff} l ON p.lecturer_id = l.id
		ORDER BY l.name ASC, p.created_at DESC
	`;
	return (await query(sql)) as LecturerPublicationDTO[];
}

/**
 * Mengambil 1 data Publikasi Dosen berdasarkan ID (dilengkapi nama & NIDN dosen)
 */
export async function getLecturerPublicationById(
	id: string
): Promise<LecturerPublicationDTO | null> {
	const sql = `
		SELECT 
			p.id,
			p.lecturer_id,
			l.name AS lecturer_name,
			l.nidn,
			p.sinta_link,
			p.scholar_link,
			p.created_at,
			p.updated_at
		FROM ${tableLecturerPublication} p
		LEFT JOIN ${tableLecturerStaff} l ON p.lecturer_id = l.id
		WHERE p.id = ? 
		LIMIT 1
	`;
	const rows = (await query(sql, [id])) as LecturerPublicationDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Publikasi Dosen baru
 */
export async function createLecturerPublication(
	id: string,
	lecturerId: string,
	sintaLink: string | null,
	scholarLink: string | null
): Promise<boolean> {
	const sql = `
		INSERT INTO ${tableLecturerPublication} (id, lecturer_id, sinta_link, scholar_link) 
		VALUES (?, ?, ?, ?)
	`;
	const result = (await query(sql, [
		id,
		lecturerId,
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
	lecturerId: string,
	sintaLink: string | null,
	scholarLink: string | null
): Promise<boolean> {
	const sql = `
		UPDATE ${tableLecturerPublication} 
		SET 
			lecturer_id = ?, 
			sinta_link = ?, 
			scholar_link = ?, 
			updated_at = NOW() 
		WHERE id = ?
	`;
	const result = (await query(sql, [
		lecturerId,
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
