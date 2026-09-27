import { query } from '$lib/database/svelteDb';
import type { NewsItemDTO } from '$lib/dto/admin/article/berita';
import type { CreateNewsData, NewsCategoryDTO, UpdateNewsData } from '$lib/dto/admin/dataset';
import { tableNews } from '$lib/seeder/admin/article/berita';
import { tableNewsCategory } from '$lib/seeder/admin/dataset';

/**
 * Tambah berita baru (Create)
 */
export async function createNews(id: string, data: CreateNewsData): Promise<boolean> {
	const sql = `
		INSERT INTO ${tableNews} (id, title, category_id, content, image_url, published_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`;
	const params = [
		id,
		data.title,
		data.category_id,
		data.content,
		data.image_url || null,
		data.published_at || new Date()
	];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Mendapatkan semua berita (Read All)
 * Diurutkan berdasarkan tanggal terbit terbaru beserta nama kategorinya
 */
export async function getAllNews(): Promise<NewsItemDTO[]> {
	const sql = `
        SELECT 
            n.id,
            n.title,
            n.category_id,
            n.content,
            n.image_url,
            n.published_at,
            n.created_at,
            n.updated_at,
            c.name AS category_name
        FROM ${tableNews} n
        LEFT JOIN ${tableNewsCategory} c ON n.category_id = c.id
        ORDER BY n.published_at DESC
    `;
	const rows = (await query(sql)) as NewsItemDTO[];
	return rows;
}

/**
 *  Mendapatkan berita berdasarkan ID (Read One)
 */
export async function getNewsById(id: string): Promise<NewsItemDTO | null> {
	const sql = `
		SELECT 
			n.*,
			c.name AS category_name
		FROM ${tableNews} n
		LEFT JOIN ${tableNewsCategory} c ON n.category_id = c.id
		WHERE n.id = ? 
		LIMIT 1
	`;
	const rows = (await query(sql, [id])) as NewsItemDTO[];
	return rows.length > 0 ? rows[0] : null;
}

/**
 * 4. Mendapatkan berita berdasarkan ID Kategori
 */
export async function getNewsByCategoryId(categoryId: string): Promise<NewsItemDTO[]> {
	const sql = `
		SELECT 
			n.*,
			c.name AS category_name
		FROM ${tableNews} n
		LEFT JOIN ${tableNewsCategory} c ON n.category_id = c.id
		WHERE n.category_id = ? 
		ORDER BY n.published_at DESC
	`;
	const rows = (await query(sql, [categoryId])) as NewsItemDTO[];
	return rows;
}

/**
 * 5. Mengambil data berita terbaru (termasuk pagination/limit)
 */
export async function getRecentNews(limit: number = 10): Promise<NewsItemDTO[]> {
	const sql = `
		SELECT 
			n.id, 
			n.title, 
			n.category_id, 
			n.content,
			n.image_url,
			n.published_at, 
			n.created_at, 
			n.updated_at,
			c.name AS category_name
		FROM ${tableNews} n
		LEFT JOIN ${tableNewsCategory} c ON n.category_id = c.id
		ORDER BY n.published_at DESC 
		LIMIT ?
	`;
	const rows = (await query(sql, [limit])) as NewsItemDTO[];
	return rows;
}

/**
 * Mendapatkan data detail kategori berita berdasarkan Slug (Read One by Slug)
 */
export async function getNewsCategoryBySlug(slug: string): Promise<NewsCategoryDTO | null> {
    const sql = `
        SELECT 
            id, 
            name, 
            slug, 
            created_at, 
            updated_at 
        FROM ${tableNewsCategory}
        WHERE slug = ? 
        LIMIT 1
    `;
    const rows = (await query(sql, [slug])) as NewsCategoryDTO[];
    return rows.length > 0 ? rows[0] : null;
}

/**
 * Mendapatkan semua daftar berita berdasarkan Slug Kategori (Read All by Category Slug)
 */
export async function getNewsByCategorySlug(slug: string): Promise<NewsItemDTO[]> {
    const sql = `
        SELECT 
            n.id,
            n.title,
            n.category_id,
            n.content,
            n.image_url,
            n.published_at,
            n.created_at,
            n.updated_at,
            c.name AS category_name
        FROM ${tableNews} n
        INNER JOIN ${tableNewsCategory} c ON n.category_id = c.id
        WHERE c.slug = ?
        ORDER BY n.published_at DESC
    `;
    const rows = (await query(sql, [slug])) as NewsItemDTO[];
    return rows;
}

/**
 * Mendapatkan berita berdasarkan Slug Kategori dengan range slicing (from & to) untuk pagination
 * @param slug Slug kategori berita (misal: 'teknologi')
 * @param from Indeks offset awal (0-based)
 * @param to Indeks offset akhir
 */
export async function getNewsByCategorySlugSlice(
    slug: string,
    from: number,
    to: number
): Promise<NewsItemDTO[]> {
    const offset = Math.max(0, from);
    const limit = Math.max(0, to - offset);

    const sql = `
        SELECT 
            n.id, 
            n.title, 
            n.category_id, 
            n.content,
            n.image_url,
            n.published_at, 
            n.created_at, 
            n.updated_at,
            c.name AS category_name
        FROM ${tableNews} n
        INNER JOIN ${tableNewsCategory} c ON n.category_id = c.id
        WHERE c.slug = ?
        ORDER BY n.published_at DESC 
        LIMIT ? OFFSET ?
    `;

    const rows = (await query(sql, [slug, limit, offset])) as NewsItemDTO[];
    return rows;
}

/**
 * Mendapatkan total jumlah berita berdasarkan Slug Kategori
 * (Sangat berguna untuk menghitung total halaman / total_pages pada pagination halaman kategori)
 */
export async function getTotalNewsCountByCategorySlug(slug: string): Promise<number> {
    const sql = `
        SELECT COUNT(n.id) AS total 
        FROM ${tableNews} n
        INNER JOIN ${tableNewsCategory} c ON n.category_id = c.id
        WHERE c.slug = ?
    `;
    const result = (await query(sql, [slug])) as any[];
    return result[0]?.total || 0;
}

/**
 *  Update berita (Update)
 * Memperbarui data berita secara dinamis berdasarkan kolom yang dikirim
 */
export async function updateNews(id: string, data: UpdateNewsData): Promise<boolean> {
	const fields = Object.keys(data);
	if (fields.length === 0) return false;

	const columnMapping: Record<string, string> = {
		title: 'title',
		category_id: 'category_id',
		content: 'content',
		image_url: 'image_url',
		published_at: 'published_at'
	};

	const setClause = fields.map((key) => `${columnMapping[key] || key} = ?`).join(', ');
	const sql = `UPDATE ${tableNews} SET ${setClause} WHERE id = ?`;
	const params = [...Object.values(data), id];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * 7. Hapus berita (Delete)
 */
export async function deleteNews(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableNews} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}

/**
 *  Mendapatkan data berita berdasarkan range slicing (from & to) untuk pagination
 * @param from Indeks awal (0-based offset, misal: 0)
 * @param to Indeks akhir (exclusive, misal: 10 untuk mengambil data ke-0 sampai ke-9)
 */
export async function getNewsBySlice(from: number, to: number): Promise<NewsItemDTO[]> {
	// Memastikan offset tidak minus dan menghitung limit (jumlah baris yang diambil)
	const offset = Math.max(0, from);
	const limit = Math.max(0, to - offset);

	const sql = `
        SELECT 
            n.id, 
            n.title, 
            n.category_id, 
            n.content,
            n.image_url,
            n.published_at, 
            n.created_at, 
            n.updated_at,
            c.name AS category_name
        FROM ${tableNews} n
        LEFT JOIN ${tableNewsCategory} c ON n.category_id = c.id
        ORDER BY n.published_at DESC 
        LIMIT ? OFFSET ?
    `;

	const rows = (await query(sql, [limit, offset])) as NewsItemDTO[];
	return rows;
}

/**
 * Mendapatkan total keseluruhan data berita
 * (Sangat berguna untuk menghitung total halaman / total_pages pada pagination)
 */
export async function getTotalNewsCount(): Promise<number> {
	const sql = `SELECT COUNT(*) AS total FROM ${tableNews}`;
	const result = (await query(sql)) as any[];
	return result[0]?.total || 0;
}
