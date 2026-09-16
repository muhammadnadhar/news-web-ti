import { tableLecturerStaff } from '$lib/seeder/admin/article/profile';

import { query } from '$lib/server/database/svelteDb';

import type {
	CreateLecturerStaffData,
	LecturerStaffItemDTO,
	UpdateLecturerStaffData
} from '$lib/types/admin/article/profile';

/**
 * TAMBAH DOSEN / staff baru (create)
 */
export async function createLecturerStaff(
	id: string,
	data: CreateLecturerStaffData
): Promise<boolean> {
	const sql = `
        INSERT INTO ${tableLecturerStaff} (
            id, 
            name, 
            nidn, 
            pddikti_url, 
            expertise, 
            role, 
            photo_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
	const params = [
		id,
		data.name,
		data.nidn || null,
		data.pddikti_url || null,
		data.expertise,
		data.role || 'Dosen',
		data.is_primary || false,
		data.photo_url || null
	];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * mendapatkan semua dosen & staff (read all)
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
 * mendapatkan data berdasarkan role ('dosen' atau 'staff')
 */
export async function getLecturerStaffByRole(
	role: 'Dosen' | 'Staff'
): Promise<LecturerStaffItemDTO[]> {
	const sql = `SELECT * FROM ${tableLecturerStaff} WHERE role = ? ORDER BY name ASC`;
	const rows = (await query(sql, [role])) as LecturerStaffItemDTO[];
	return rows;
}

// /**
//  * MENDAPATKAN DATA UTAMA / PRIMARY UNTUK HOMEPAGE (is_primary = TRUE)
//  */
// export async function getPrimaryLecturerStaff(): Promise<LecturerStaffItemDTO[]> {
// 	const sql = `SELECT * FROM ${tableLecturerStaff} WHERE is_primary = TRUE ORDER BY name ASC`;
// 	const rows = (await query(sql)) as LecturerStaffItemDTO[];
// 	return rows;
// }

/**
 * MENDAPATKAN DATA PRIMARY BERDASARKAN ROLE (is_primary = TRUE & Role)
 */
export async function getPrimaryLecturerStaffByRole(
	role: 'Dosen' | 'Staff'
): Promise<LecturerStaffItemDTO[]> {
	const sql = `SELECT * FROM ${tableLecturerStaff} WHERE role = ? AND is_primary = TRUE ORDER BY name ASC`;
	const rows = (await query(sql, [role])) as LecturerStaffItemDTO[];
	return rows;
}

/**
 * update data dosen / staff (update)
 */
export async function updateLecturerStaff(
	id: string,
	data: UpdateLecturerStaffData
): Promise<boolean> {
	const sql = `
        UPDATE ${tableLecturerStaff} 
        SET 
            name = ?, 
            nidn = ?, 
            pddikti_url = ?, 
            expertise = ?, 
            role = ?, 
            photo_url = ?
        WHERE id = ?
    `;
	const params = [
		data.name,
		data.nidn || null,
		data.pddikti_url || null,
		data.expertise,
		data.role || 'Dosen',
		data.is_primary ?? false,
		data.photo_url || null,
		id
	];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * HAPUS DOSEN / staff (delete)
 */
export async function deleteLecturerStaff(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableLecturerStaff} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
