import { query } from '$lib/database/svelteDb';
import type {
	CreateNewsCategoryData,
	NewsCategoryDTO,
	UpdateNewsCategoryData
} from '$lib/dto/admin/dataset';
import { tableNewsCategory } from '$lib/seeder/admin/dataset';

/**
 *  Mendapatkan semua kategori berita (Read All)
 * Berguna untuk dropdown pilihan kategori atau tabel daftar kategori
 */
export async function getAllNewsCategories(): Promise<NewsCategoryDTO[]> {
	const sql = `
        SELECT 
            id, 
            name, 
            slug, 
            created_at, 
            updated_at 
        FROM ${tableNewsCategory}
        ORDER BY name ASC
    `;
	const rows = (await query(sql, [])) as NewsCategoryDTO[];
	return rows;
}

/**
 * 2. Mendapatkan kategori berita berdasarkan ID (Read One / Specific ID)
 */
export async function getNewsCategoryById(id: string): Promise<NewsCategoryDTO | null> {
	const sql = `
        SELECT 
            id, 
            name, 
            slug, 
            created_at, 
            updated_at 
        FROM ${tableNewsCategory}
        WHERE id = ? 
        LIMIT 1
    `;
	const rows = (await query(sql, [id])) as NewsCategoryDTO[];
	return rows.length > 0 ? rows[0] : null;
}

/**
 * 3. Menambah kategori berita baru (Create)
 */
export async function createNewsCategory(
	id: string,
	data: CreateNewsCategoryData
): Promise<boolean> {
	const sql = `
        INSERT INTO ${tableNewsCategory} (id, name, slug)
        VALUES (?, ?, ?)
    `;
	const params = [id, data.name, data.slug || null];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * 4. Memperbarui kategori berita secara dinamis (Update)
 */
export async function updateNewsCategory(
	id: string,
	data: UpdateNewsCategoryData
): Promise<boolean> {
	const fields = Object.keys(data);
	if (fields.length === 0) return false;

	const columnMapping: Record<string, string> = {
		name: 'name',
		slug: 'slug'
	};

	const setClause = fields.map((key) => `${columnMapping[key] || key} = ?`).join(', ');
	const sql = `UPDATE ${tableNewsCategory} SET ${setClause} WHERE id = ?`;
	const params = [...Object.values(data), id];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * 5. Menghapus kategori berita berdasarkan ID (Delete)
 */
export async function deleteNewsCategory(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableNewsCategory} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
