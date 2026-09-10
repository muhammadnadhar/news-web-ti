import { tableLecturerStaff } from '$lib/seeder/admin/article/profile';

import { query } from '$lib/server/database/svelteDb';

import type {
	CreateLecturerStaffData,
	LecturerStaffItemDTO,
	UpdateLecturerStaffData
} from '$lib/types/admin/article/profile';

/**
 * 1. TAMBAH DOSEN / STAFF BARU (Create)
 */
export async function createLecturerStaff(
	id: string,
	data: CreateLecturerStaffData
): Promise<boolean> {
	const sql = `
		INSERT INTO ${tableLecturerStaff} (id, name, nidn, expertise, photo_url)
		VALUES (?, ?, ?, ?, ?)
	`;
	const params = [id, data.name, data.nidn || null, data.expertise, data.photo_url || null];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 *MENDAPATKAN SEMUA DOSEN & STAFF (Read All)
 */
export async function getAllLecturerStaff(): Promise<LecturerStaffItemDTO[]> {
	const sql = `SELECT * FROM ${tableLecturerStaff} ORDER BY name ASC`;
	const rows = (await query(sql)) as LecturerStaffItemDTO[];
	return rows;
}
/**
 * MENDAPATKAN DOSEN & STAFF BERDASARKAN ID (Read One)
 */
export async function getLecturerStaffById(id: string): Promise<LecturerStaffItemDTO | null> {
    const sql = `SELECT * FROM ${tableLecturerStaff} WHERE id = ? LIMIT 1`;
    const rows = (await query(sql, [id])) as LecturerStaffItemDTO[];
    return rows.length > 0 ? rows[0] : null;
}
/**
 * UPDATE DATA DOSEN / STAFF (Update)
 */
export async function updateLecturerStaff(
	id: string,
	data: UpdateLecturerStaffData
): Promise<boolean> {
	const sql = `
		UPDATE ${tableLecturerStaff} 
		SET name = ?, nidn = ?, expertise = ?, photo_url = ?
		WHERE id = ?
	`;
	const params = [data.name, data.nidn || null, data.expertise, data.photo_url || null, id];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * 4. HAPUS DOSEN / STAFF (Delete)
 */
export async function deleteLecturerStaff(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableLecturerStaff} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
