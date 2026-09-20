import { query } from '$lib/database/svelteDb';
import type { ProfileDashboardDTO } from '$lib/dto/admin/home';
import { tableProfileDashboard } from '$lib/seeder/admin/home';

/**  get all - mengambil semua data profile dashboard */
export async function getAllProfileDashboards(): Promise<ProfileDashboardDTO[]> {
	const sql = `
        SELECT * FROM ${tableProfileDashboard} 
        ORDER BY created_at DESC
    `;
	return (await query(sql)) as ProfileDashboardDTO[];
}

/** get by id - mengambil 1 data profile dashboard berdasarkan id */
export async function getProfileDashboardById(id: string): Promise<ProfileDashboardDTO | null> {
	const sql = `
        SELECT * FROM ${tableProfileDashboard} 
        WHERE id = ? 
        LIMIT 1
    `;
	const rows = (await query(sql, [id])) as ProfileDashboardDTO[];
	return rows[0] || null;
}

/** 3. create / add - menambah profile dashboard baru */
export async function addProfileDashboard(
	data: Omit<ProfileDashboardDTO, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
	const id = crypto.randomUUID();
	const sql = `
        INSERT INTO ${tableProfileDashboard} (id, title, image_path)
        VALUES (?, ?, ?)
    `;
	await query(sql, [id, data.title, data.image_path]);
	return id;
}

/** 4. update / edit - mengubah data profile dashboard berdasarkan id */
export async function updateProfileDashboard(
	id: string,
	data: Partial<Omit<ProfileDashboardDTO, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
	const sql = `
        UPDATE ${tableProfileDashboard}
        SET title = COALESCE(?, title),
            image_path = COALESCE(?, image_path)
        WHERE id = ?
    `;
	const result: any = await query(sql, [data.title ?? null, data.image_path ?? null, id]);

	return result?.affectedRows > 0;
}

/** 5. delete - menghapus data profile dashboard berdasarkan id */
export async function deleteProfileDashboard(id: string): Promise<boolean> {
	const sql = `
        DELETE FROM ${tableProfileDashboard} 
        WHERE id = ?
    `;
	const result: any = await query(sql, [id]);
	return result?.affectedRows > 0;
}
