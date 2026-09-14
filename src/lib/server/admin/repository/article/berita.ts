import { tableNews } from '$lib/seeder/admin/article/berita';
import { query } from '$lib/server/database/svelteDb';
import type { NewsItemDTO } from '$lib/types/admin/article/berita';

export type CreateNewsData = Omit<NewsItemDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateNewsData = Partial<CreateNewsData>;

/**
 * tambah berita baru (create)
 */
export async function createNews(id: string, data: CreateNewsData): Promise<boolean> {
	const sql = `
        INSERT INTO ${tableNews} (id, title, category, published_at)
        VALUES (?, ?, ?, ?)
    `;
	const params = [
		id,
		data.title,
		data.category,
		data.content,
		data.image_url || null,
		data.published_at || new Date()
	];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 *  mendapatkan semua berita (read all)
 * Diurutkan berdasarkan tanggal terbit terbaru
 */
export async function getAllNews(): Promise<NewsItemDTO[]> {
	const sql = `SELECT * FROM ${tableNews} ORDER BY published_at DESC`;
	const rows = (await query(sql)) as NewsItemDTO[];
	return rows;
}

/**
 * 3. mendapatkan berita berdasarkan id (read one)
 */
export async function getNewsById(id: string): Promise<NewsItemDTO | null> {
	const sql = `SELECT * FROM ${tableNews} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as NewsItemDTO[];
	return rows.length > 0 ? rows[0] : null;
}

/**
 *  mendapatkan berita berdasarkan kategori
 */
export async function getNewsByCategory(category: string): Promise<NewsItemDTO[]> {
	const sql = `SELECT * FROM ${tableNews} WHERE category = ? ORDER BY published_at DESC`;
	const rows = (await query(sql, [category])) as NewsItemDTO[];
	return rows;
}

/**
 * Mengambil 10 data berita terbaru berdasarkan tanggal publikasi (published_at)
 */
export async function getRecentNews(limit: number = 10): Promise<NewsItemDTO[]> {
	const sql = `
		SELECT id, title, category, published_at, created_at, updated_at 
		FROM ${tableNews} 
		ORDER BY published_at DESC 
		LIMIT ?
	`;
	const rows = (await query(sql, [limit])) as NewsItemDTO[];
	return rows;
}

/**
 * 5. UPDATE BERITA (Update)
 * Memperbarui data berita secara dinamis berdasarkan kolom yang dikirim
 */
export async function updateNews(id: string, data: UpdateNewsData): Promise<boolean> {
	const fields = Object.keys(data);
	if (fields.length === 0) return false;

	const columnMapping: Record<string, string> = {
		title: 'title',
		category: 'category',
		published_at: 'published_at'
	};

	const setClause = fields.map((key) => `${columnMapping[key] || key} = ?`).join(', ');
	const sql = `UPDATE ${tableNews} SET ${setClause} WHERE id = ?`;
	const params = [...Object.values(data), id];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * 6. HAPUS BERITA (Delete)
 */
export async function deleteNews(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableNews} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
