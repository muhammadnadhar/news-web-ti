import { query } from '$lib/database/svelteDb';
import type {
	CreateOrgStructureData,
	OrgStructureItemDTO,
	UpdateOrgStructureData
} from '$lib/dto/admin/article/profile';
import { tableOrganizationalStructure } from '$lib/seeder/admin/article/profile';

/**
 * Tambah struktur organisasi (create)
 */
export async function createOrgStructure(
	id: string,
	data: CreateOrgStructureData
): Promise<boolean> {
	const sql = `
        INSERT INTO ${tableOrganizationalStructure} (id, title, image_url, image_public_id, description)
        VALUES (?, ?, ?, ?, ?)
    `;
	const params = [
		id,
		data.title,
		data.image_url || null,
		data.image_public_id || null,
		data.description || null
	];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Mendapatkan semua struktur organisasi (read all)
 */
export async function getAllOrgStructures(): Promise<OrgStructureItemDTO[]> {
	const sql = `SELECT * FROM ${tableOrganizationalStructure} ORDER BY created_at DESC`;
	const rows = (await query(sql)) as OrgStructureItemDTO[];
	return rows;
}

/**
 * Mengambil hanya image_public_id dari Struktur Organisasi berdasarkan ID
 *
 * @param id - ID Struktur Organisasi
 * @returns Promise<string | null> - Mengembalikan string image_public_id atau null jika tidak ditemukan
 */
export async function getPublicIdOrgStructureById(id: string): Promise<string | null> {
	const sql = `SELECT image_public_id FROM ${tableOrganizationalStructure} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as Array<{ image_public_id: string | null }>;

	return rows[0]?.image_public_id ?? null;
}

/**
 * Update struktur organisasi (update)
 */
export async function updateOrgStructure(
	id: string,
	data: UpdateOrgStructureData
): Promise<boolean> {
	const sql = `
        UPDATE ${tableOrganizationalStructure}
        SET 
            title = ?, 
            image_url = ?, 
            image_public_id = ?, 
            description = ?,
            updated_at = NOW()
        WHERE id = ?
    `;
	const params = [
		data.title,
		data.image_url || null,
		data.image_public_id || null,
		data.description || null,
		id
	];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Hapus struktur organisasi (delete)
 */
export async function deleteOrgStructure(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableOrganizationalStructure} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
