import { query } from '$lib/database/svelteDb';
import type { ProfilProdiItemDTO } from '$lib/dto/admin/home';
import { tableProfilProdi } from '$lib/seeder/admin/home';

/** READ ALL PROFIL PRODI */
export async function getAllProfilProdi(): Promise<ProfilProdiItemDTO[]> {
	const sql = `SELECT * FROM ${tableProfilProdi} ORDER BY created_at DESC`;
	return (await query(sql)) as ProfilProdiItemDTO[];
}

/** read profil prodi by id */
export async function getProfilProdiById(id: string): Promise<ProfilProdiItemDTO | null> {
	const sql = `SELECT * FROM ${tableProfilProdi} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as ProfilProdiItemDTO[];
	return rows.length > 0 ? rows[0] : null;
}

/** create / add profil prodi */
export async function addProfilProdi(
	data: Omit<ProfilProdiItemDTO, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
	const id = crypto.randomUUID();
	const sql = `
		INSERT INTO ${tableProfilProdi} (id, title, description, image_url)
		VALUES (?, ?, ?, ?)
	`;
	await query(sql, [id, data.title, data.description, data.image_url ?? null]);
	return id;
}

/** UPDATE PROFIL PRODI */
export async function updateProfilProdi(
	id: string,
	data: Partial<Omit<ProfilProdiItemDTO, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
	const fields: string[] = [];
	const values: any[] = [];

	if (data.title !== undefined) {
		fields.push('title = ?');
		values.push(data.title);
	}
	if (data.description !== undefined) {
		fields.push('description = ?');
		values.push(data.description);
	}
	if (data.image_url !== undefined) {
		fields.push('image_url = ?');
		values.push(data.image_url);
	}

	if (fields.length === 0) return false;

	values.push(id);
	const sql = `UPDATE ${tableProfilProdi} SET ${fields.join(', ')} WHERE id = ?`;
	const result = (await query(sql, values)) as any;
	return result.affectedRows > 0;
}

/** REPLACE PROFIL PRODI (UPSERT FULL DATA) */
export async function replaceProfilProdi(data: ProfilProdiItemDTO): Promise<boolean> {
	const sql = `
		REPLACE INTO ${tableProfilProdi} (id, title, description, image_url)
		VALUES (?, ?, ?, ?)
	`;
	const result = (await query(sql, [
		data.id,
		data.title,
		data.description,
		data.image_url ?? null
	])) as any;
	return result.affectedRows > 0;
}

/** DELETE PROFIL PRODI */
export async function deleteProfilProdi(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableProfilProdi} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
