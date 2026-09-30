import { query } from '$lib/database/svelteDb';
import type {
	CreateFacilityDTO,
	FacilityEntity,
	FacilityFilterDTO,
	UpdateFacilityDTO
} from '$lib/dto/admin/article/profile';
import { tableFacility } from '$lib/seeder/admin/article/profile';

/**
 * Mengambil semua data fasilitas laboratorium (Read All)
 */
export async function getAllFacilities(): Promise<FacilityEntity[]> {
	const sql = `SELECT * FROM ${tableFacility} ORDER BY created_at DESC`;
	const rows = (await query(sql)) as FacilityEntity[];
	return rows;
}

/**
 * Mengambil data fasilitas laboratorium dengan pencarian, filter kategori, dan paginasi
 */
export async function getFacilities(
	filters: FacilityFilterDTO = {}
): Promise<{ data: FacilityEntity[]; total: number }> {
	const { search, category, page = 1, limit = 10 } = filters;
	const offset = (page - 1) * limit;

	const whereClauses: string[] = [];
	const params: any[] = [];

	if (search) {
		whereClauses.push('(name LIKE ? OR brand_model LIKE ? OR description LIKE ?)');
		const searchParam = `%${search}%`;
		params.push(searchParam, searchParam, searchParam);
	}

	if (category) {
		whereClauses.push('category = ?');
		params.push(category);
	}

	const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

	const countSql = `SELECT COUNT(*) as total FROM ${tableFacility} ${whereSql}`;
	const countRows = (await query(countSql, params)) as any[];
	const total = countRows[0]?.total || 0;

	const dataSql = `
        SELECT * FROM ${tableFacility} 
        ${whereSql} 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
    `;
	const rows = (await query(dataSql, [
		...params,
		Number(limit),
		Number(offset)
	])) as FacilityEntity[];

	return {
		data: rows,
		total
	};
}

/**
 * Mengambil data fasilitas laboratorium berdasarkan rentang slicing (from, to)
 */
export async function getFacilitiesBySlice(
	from: number,
	to: number,
	filters: { search?: string; category?: string } = {}
): Promise<FacilityEntity[]> {
	const { search, category } = filters;
	const offset = Math.max(0, from);
	const limit = Math.max(0, to - from);

	const whereClauses: string[] = [];
	const params: any[] = [];

	if (search) {
		whereClauses.push('(name LIKE ? OR brand_model LIKE ? OR description LIKE ?)');
		const searchParam = `%${search}%`;
		params.push(searchParam, searchParam, searchParam);
	}

	if (category) {
		whereClauses.push('category = ?');
		params.push(category);
	}

	const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

	const sql = `
        SELECT * FROM ${tableFacility} 
        ${whereSql} 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
    `;

	const rows = (await query(sql, [...params, Number(limit), Number(offset)])) as FacilityEntity[];
	return rows;
}

/**
 * Mengambil total jumlah data fasilitas laboratorium untuk menghitung paginasi
 */
export async function getTotalFacilitiesCount(
	filters: { search?: string; category?: string } = {}
): Promise<number> {
	const { search, category } = filters;
	const whereClauses: string[] = [];
	const params: any[] = [];

	if (search) {
		whereClauses.push('(name LIKE ? OR brand_model LIKE ? OR description LIKE ?)');
		const searchParam = `%${search}%`;
		params.push(searchParam, searchParam, searchParam);
	}

	if (category) {
		whereClauses.push('category = ?');
		params.push(category);
	}

	const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

	const countSql = `SELECT COUNT(*) as total FROM ${tableFacility} ${whereSql}`;
	const countRows = (await query(countSql, params)) as any[];
	return countRows[0]?.total || 0;
}

/**
 * Mengambil satu data fasilitas laboratorium berdasarkan ID
 */
export async function getFacilityById(id: string): Promise<FacilityEntity | null> {
	const sql = `SELECT * FROM ${tableFacility} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as FacilityEntity[];
	if (!rows || rows.length === 0) return null;
	return rows[0];
}

/**
 * Mengambil daftar kategori fasilitas unik untuk opsi filter UI
 */
export async function getFacilityCategories(): Promise<string[]> {
	const sql = `SELECT DISTINCT category FROM ${tableFacility} ORDER BY category ASC`;
	const rows = (await query(sql)) as { category: string }[];
	return rows.map((r) => r.category);
}

/**
 * Mengambil hanya image_public_id dari Fasilitas laboratorium berdasarkan ID
 *
 * @param id - ID Fasilitas
 * @returns Promise<string | null> - Mengembalikan string image_public_id atau null jika tidak ditemukan
 */
export async function getPublicIdFacilityById(id: string): Promise<string | null> {
	const sql = `SELECT image_public_id FROM ${tableFacility} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as Array<{ image_public_id: string | null }>;

	return rows[0]?.image_public_id ?? null;
}

/**
 * Menambahkan data fasilitas laboratorium baru
 */
export async function createFacility(id: string, data: CreateFacilityDTO): Promise<boolean> {
	const sql = `
        INSERT INTO ${tableFacility} (id, name, image_url, image_public_id, brand_model, description, category, sop_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
	const params = [
		id,
		data.name,
		data.imageUrl || null,
		data.image_public_id || null,
		data.brandModel || null,
		data.description || null,
		data.category,
		data.sopUrl || null
	];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data fasilitas laboratorium berdasarkan ID
 */
export async function updateFacility(id: string, data: UpdateFacilityDTO): Promise<boolean> {
	const updates: string[] = [];
	const params: any[] = [];

	if (data.name !== undefined) {
		updates.push('name = ?');
		params.push(data.name);
	}
	if (data.imageUrl !== undefined) {
		updates.push('image_url = ?');
		params.push(data.imageUrl);
	}
	if (data.image_public_id !== undefined) {
		updates.push('image_public_id = ?');
		params.push(data.image_public_id);
	}
	if (data.brandModel !== undefined) {
		updates.push('brand_model = ?');
		params.push(data.brandModel);
	}
	if (data.description !== undefined) {
		updates.push('description = ?');
		params.push(data.description);
	}
	if (data.category !== undefined) {
		updates.push('category = ?');
		params.push(data.category);
	}
	if (data.sopUrl !== undefined) {
		updates.push('sop_url = ?');
		params.push(data.sopUrl);
	}

	if (updates.length === 0) return false;

	params.push(id);
	const sql = `UPDATE ${tableFacility} SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data fasilitas laboratorium berdasarkan ID
 */
export async function deleteFacility(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableFacility} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
