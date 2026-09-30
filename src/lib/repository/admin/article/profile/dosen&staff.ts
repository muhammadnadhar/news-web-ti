import { query } from '$lib/database/svelteDb';
import type {
	CreateLecturerStaffData,
	LecturerStaffItemDTO,
	UpdateLecturerStaffData
} from '$lib/dto/admin/article/profile';
import { tableLecturerStaff } from '$lib/seeder/admin/article/profile';

/**
 * Tambah dosen / staff baru (create)
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
            is_primary,
            photo_url,
            photo_public_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

	const params = [
		id,
		data.name,
		data.nidn || null,
		data.pddikti_url || null,
		data.expertise,
		data.role || 'Dosen',
		data.is_primary || false,
		data.photo_url || null,
		data.photo_public_id || null
	];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Mendapatkan semua dosen & staff (read all)
 */
export async function getAllLecturerStaff(): Promise<LecturerStaffItemDTO[]> {
	const sql = `SELECT * FROM ${tableLecturerStaff} ORDER BY name ASC`;
	const rows = (await query(sql)) as LecturerStaffItemDTO[];
	return rows;
}

/**
 * Mendapatkan dosen & staff berdasarkan ID (Read One)
 */
export async function getLecturerStaffById(id: string): Promise<LecturerStaffItemDTO | null> {
	const sql = `SELECT * FROM ${tableLecturerStaff} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as LecturerStaffItemDTO[];
	return rows.length > 0 ? rows[0] : null;
}

/**
 * Mendapatkan data berdasarkan role ('Dosen' atau 'Staff')
 */
export async function getLecturerStaffByRole(
	role: 'Dosen' | 'Staff'
): Promise<LecturerStaffItemDTO[]> {
	const sql = `SELECT * FROM ${tableLecturerStaff} WHERE role = ? ORDER BY name ASC`;
	const rows = (await query(sql, [role])) as LecturerStaffItemDTO[];
	return rows;
}

/**
 * Mendapatkan data primary berdasarkan role (is_primary = TRUE & Role)
 */
export async function getPrimaryLecturerStaffByRole(
	role: 'Dosen' | 'Staff'
): Promise<LecturerStaffItemDTO[]> {
	const sql = `SELECT * FROM ${tableLecturerStaff} WHERE role = ? AND is_primary = TRUE ORDER BY name ASC`;
	const rows = (await query(sql, [role])) as LecturerStaffItemDTO[];
	return rows;
}

/**
 * Mengambil hanya photo_public_id dari data Dosen/Staf berdasarkan ID
 *
 * @param id - ID Dosen/Staf
 * @returns Promise<string | null> - Mengembalikan string photo_public_id atau null jika tidak ditemukan
 */
export async function getPhotoPublicIdLecturerStaffById(id: string): Promise<string | null> {
	const sql = `SELECT photo_public_id FROM ${tableLecturerStaff} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as Array<{ photo_public_id: string | null }>;

	return rows[0].photo_public_id ?? null;
}

/**
 * Update data dosen / staff (update)
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
            is_primary = ?,
            photo_url = ?,
            photo_public_id = ?
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
		data.photo_public_id || null,
		id
	];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Hapus dosen / staff (delete)
 */
export async function deleteLecturerStaff(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableLecturerStaff} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
