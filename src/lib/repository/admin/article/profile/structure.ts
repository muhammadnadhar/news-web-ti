import { query } from '$lib/database/svelteDb';
import type { CreateOrgStructureData, OrgStructureItemDTO, UpdateOrgStructureData } from '$lib/dto/admin/article/profile';
import { tableOrganizationalStructure } from '$lib/seeder/admin/article/profile';
/**
 * tambah struktur organisasi (create)
 */
export async function createOrgStructure(
	id: string,
	data: CreateOrgStructureData
): Promise<boolean> {
	const sql = `
		INSERT INTO ${tableOrganizationalStructure} (id, title, image_url, description)
		VALUES (?, ?, ?, ?)
	`;
	const params = [id, data.title, data.image_url || null, data.description || null];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 *  mendapatkan semua struktur organisasi (read all)
 */
export async function getAllOrgStructures(): Promise<OrgStructureItemDTO[]> {
	const sql = `SELECT * FROM ${tableOrganizationalStructure} ORDER BY created_at DESC`;
	const rows = (await query(sql)) as OrgStructureItemDTO[];
	return rows;
}

/**
 * update struktur organisasi (update)
 */
export async function updateOrgStructure(
	id: string,
	data: UpdateOrgStructureData
): Promise<boolean> {
	const sql = `
		UPDATE ${tableOrganizationalStructure}
		SET title = ?, image_url = ?, description = ?
		WHERE id = ?
	`;
	const params = [data.title, data.image_url || null, data.description || null, id];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * 4. HAPUS STRUKTUR ORGANISASI (Delete)
 */
export async function deleteOrgStructure(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableOrganizationalStructure} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
