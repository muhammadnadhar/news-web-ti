import { query } from '$lib/database/svelteDb';
import type { ProfileDashboardDTO } from '$lib/dto/admin/home';
import { tableProfileDashboard } from '$lib/seeder/admin/home';
/** Get all - mengambil semua data profile dashboard */
export async function getAllProfileDashboards(): Promise<ProfileDashboardDTO[]> {
	const sql = `
        SELECT * FROM ${tableProfileDashboard} 
        ORDER BY created_at DESC
    `;
	return (await query(sql)) as ProfileDashboardDTO[];
}

/**
 * Mengambil hanya image_public_id dari Profile Dashboard berdasarkan ID
 *
 * @param id - ID Profile Dashboard
 * @returns Promise<string | null> - Mengembalikan string image_public_id atau null jika tidak ditemukan
 */
export async function getPublicIdProfileDashboardById(id: string): Promise<string | null> {
	const sql = `
        SELECT image_public_id FROM ${tableProfileDashboard} 
        WHERE id = ? 
        LIMIT 1
    `;
	const rows = (await query(sql, [id])) as Array<{ image_public_id: string | null }>;

	return rows[0]?.image_public_id ?? null;
}

/** Get by id - mengambil 1 data profile dashboard berdasarkan id */
export async function getProfileDashboardById(id: string): Promise<ProfileDashboardDTO | null> {
	const sql = `
        SELECT * FROM ${tableProfileDashboard} 
        WHERE id = ? 
        LIMIT 1
    `;
	const rows = (await query(sql, [id])) as ProfileDashboardDTO[];
	return rows[0] || null;
}

/** Create / add - menambah profile dashboard baru */
export async function addProfileDashboard(
	id: string,
	data: Omit<ProfileDashboardDTO, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
	const sql = `
        INSERT INTO ${tableProfileDashboard} (id, title, image_path, image_public_id)
        VALUES (?, ?, ?, ?)
    `;
	await query(sql, [id, data.title, data.image_path ?? null, data.image_public_id ?? null]);
	return id;
}

/** Update / edit - mengubah data profile dashboard berdasarkan id */
export async function updateProfileDashboard(
	id: string,
	data: Partial<Omit<ProfileDashboardDTO, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
	const sql = `
        UPDATE ${tableProfileDashboard}
        SET title = COALESCE(?, title),
            image_path = COALESCE(?, image_path),
            image_public_id = COALESCE(?, image_public_id),
            updated_at = NOW()
        WHERE id = ?
    `;
	const result: any = await query(sql, [
		data.title ?? null,
		data.image_path ?? null,
		data.image_public_id ?? null,
		id
	]);

	return result?.affectedRows > 0;
}

/** Delete - menghapus data profile dashboard berdasarkan id */
export async function deleteProfileDashboard(id: string): Promise<boolean> {
	const sql = `
        DELETE FROM ${tableProfileDashboard} 
        WHERE id = ?
    `;
	const result: any = await query(sql, [id]);
	return result?.affectedRows > 0;
}
