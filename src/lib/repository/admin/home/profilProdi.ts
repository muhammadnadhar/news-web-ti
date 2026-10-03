import { query } from '$lib/database/svelteDb';
import type { ImageItem, ProfilProdiItemDTO } from '$lib/dto/admin/home';
import { tableProfilProdi } from '$lib/seeder/admin/home';
/**
 * Helper internal untuk mengonversi baris database (raw MySQL row) ke DTO
 */
function mapRowToDTO(row: any): ProfilProdiItemDTO {
	let images: ImageItem[] = [];

	if (row.images_json) {
		try {
			images = typeof row.images_json === 'string' ? JSON.parse(row.images_json) : row.images_json;
		} catch {
			images = [];
		}
	}

	return {
		id: row.id,
		title: row.title,
		description: row.description,
		images: Array.isArray(images) ? images : [],
		display_instruction: row.display_instruction || 'FLEX_CENTER',
		created_at: row.created_at,
		updated_at: row.updated_at
	};
}

/** READ ALL PROFIL PRODI */
export async function getAllProfilProdi(): Promise<ProfilProdiItemDTO[]> {
	const sql = `SELECT * FROM ${tableProfilProdi} ORDER BY created_at DESC`;
	const rows = (await query(sql)) as any[];
	return rows.map(mapRowToDTO);
}

/** READ PROFIL PRODI BY ID */
export async function getProfilProdiById(id: string): Promise<ProfilProdiItemDTO | null> {
	const sql = `SELECT * FROM ${tableProfilProdi} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as any[];
	return rows.length > 0 ? mapRowToDTO(rows[0]) : null;
}

/**
 * Mengambil seluruh image_public_id dari daftar gambar suatu Profil Prodi.
 * Berguna untuk menghapus aset di Cloudinary saat data/gambar dihapus.
 */
export async function getAllPublicIdsProfilProdiById(id: string): Promise<string[]> {
	const item = await getProfilProdiById(id);
	if (!item || !item.images) return [];

	return item.images.map((img) => img.public_id).filter((pubId): pubId is string => Boolean(pubId));
}
/**
 * Mengambil satu image_public_id pertama langsung dari database berdasarkan ID Profil Prodi.
 */
export async function getPublicIdProfilProdiById(id: string): Promise<string | null> {
	const item = await getProfilProdiById(id);
	if (!item || !item.images || item.images.length === 0) {
		return null;
	}
	return item.images[0].public_id || null;
}

/** create / add profil prodi */
export async function addProfilProdi(
	data: Omit<ProfilProdiItemDTO, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
	const id = crypto.randomUUID();
	const imagesJson = JSON.stringify(data.images ?? []);
	const displayInstruction = data.display_instruction ?? 'FLEX_CENTER';

	const sql = `
        INSERT INTO ${tableProfilProdi} (id, title, description, images_json, display_instruction)
        VALUES (?, ?, ?, ?, ?)
    `;
	await query(sql, [id, data.title, data.description, imagesJson, displayInstruction]);
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
	if (data.images !== undefined) {
		fields.push('images_json = ?');
		values.push(JSON.stringify(data.images));
	}
	if (data.display_instruction !== undefined) {
		fields.push('display_instruction = ?');
		values.push(data.display_instruction);
	}

	if (fields.length === 0) return false;

	values.push(id);
	const sql = `UPDATE ${tableProfilProdi} SET ${fields.join(', ')} WHERE id = ?`;
	const result = (await query(sql, values)) as any;
	return result.affectedRows > 0;
}

/** REPLACE PROFIL PRODI (UPSERT FULL DATA) */
export async function replaceProfilProdi(data: ProfilProdiItemDTO): Promise<boolean> {
	const imagesJson = JSON.stringify(data.images ?? []);
	const displayInstruction = data.display_instruction ?? 'FLEX_CENTER';

	const sql = `
        REPLACE INTO ${tableProfilProdi} (id, title, description, images_json, display_instruction)
        VALUES (?, ?, ?, ?, ?)
    `;
	const result = (await query(sql, [
		data.id,
		data.title,
		data.description,
		imagesJson,
		displayInstruction
	])) as any;
	return result.affectedRows > 0;
}

/** QUICK UPDATE: EDIT HANYA TIPE LAYOUT INSTRUCTION */
export async function updateDisplayInstruction(id: string, instruction: string): Promise<boolean> {
	const sql = `UPDATE ${tableProfilProdi} SET display_instruction = ? WHERE id = ?`;
	const result = (await query(sql, [instruction, id])) as any;
	return result.affectedRows > 0;
}

/** DELETE PROFIL PRODI */
export async function deleteProfilProdi(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableProfilProdi} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
