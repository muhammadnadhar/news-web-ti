import { randomUUID } from '$lib/crypto';
import { query } from '$lib/database/svelteDb';
import type { CurriculumDTO, CurriculumNavDTO } from '$lib/dto/admin/article/kurikulum';
import type { ImageItem } from '$lib/dto/admin/home';
import { tableCurriculums } from '$lib/seeder/admin/article/kurikulum';

/**
 * Helper internal untuk memetakan hasil mentah database ke CurriculumDTO
 */
function mapRowToCurriculum(row: any): CurriculumDTO {
	let images: ImageItem[] = [];
	if (row.images_json) {
		try {
			images = typeof row.images_json === 'string' ? JSON.parse(row.images_json) : row.images_json;
		} catch (e) {
			console.error('Gagal parsing images_json:', e);
			images = [];
		}
	}

	return {
		id: row.id,
		title: row.title || '', // Menambahkan mapping untuk kolom title
		description: row.description,
		images: images,
		created_at: row.created_at ? new Date(row.created_at) : undefined,
		updated_at: row.updated_at ? new Date(row.updated_at) : undefined
	};
}
/**
 * Mengambil daftar kurikulum secara ringkas (hanya id dan title) untuk keperluan navigasi
 */
export async function getCurriculumsNav(): Promise<CurriculumNavDTO[]> {
	const sql = `SELECT id, title FROM ${tableCurriculums} ORDER BY created_at DESC`;
	const rows = (await query(sql)) as any[];

	if (!rows || rows.length === 0) return [];

	return rows.map((row) => ({
		id: row.id,
		title: row.title || ''
	}));
}

/**
 * Mengambil semua data Kurikulum
 */
export async function getAllCurriculums(): Promise<CurriculumDTO[]> {
	const sql = `SELECT * FROM ${tableCurriculums} ORDER BY created_at DESC`;
	const rows = (await query(sql)) as any[];

	if (!rows || rows.length === 0) return [];

	return rows.map(mapRowToCurriculum);
}

/**
 * Mengambil data Kurikulum (Ambil baris pertama)
 */
export async function getCurriculum(): Promise<CurriculumDTO | null> {
	const sql = `SELECT * FROM ${tableCurriculums} LIMIT 1`;
	const rows = (await query(sql)) as any[];

	if (!rows || rows.length === 0) return null;

	return mapRowToCurriculum(rows[0]);
}

/**
 * Mengambil 1 data Kurikulum berdasarkan ID
 */
export async function getCurriculumsById(id: string): Promise<CurriculumDTO | null> {
	const sql = `SELECT * FROM ${tableCurriculums} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as any[];

	if (!rows || rows.length === 0) return null;

	// Menggunakan mapRowToCurriculum agar parsing JSON images_json dan mapping title aman
	return mapRowToCurriculum(rows[0]);
}

/**
 * Helper function repository untuk membuat kurikulum baru (dengan dukungan title & images)
 */
export async function createCurriculums(data: {
	title: string;
	description: string;
	images: ImageItem[];
}): Promise<boolean> {
	try {
		const newId = randomUUID();
		const imagesJson = JSON.stringify(data.images);
		const createdAt = new Date();
		const updatedAt = new Date();

		const sql = `
            INSERT INTO ${tableCurriculums} (id, title, description, images_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

		await query(sql, [newId, data.title, data.description, imagesJson, createdAt, updatedAt]);

		return true;
	} catch (error) {
		console.error('Database error on createCurriculums (SQL Insert):', error);
		return false;
	}
}

/**
 * Menyimpan atau Memperbarui data Kurikulum (UPSERT logic dengan dukungan title & images)
 */
export async function saveOrUpdateCurriculum(
	title: string,
	description: string,
	images: ImageItem[] = []
): Promise<boolean> {
	const existing = await getCurriculum();
	const imagesJsonString = JSON.stringify(images);

	if (existing) {
		const sql = `
            UPDATE ${tableCurriculums} 
            SET title = ?, description = ?, images_json = ?, updated_at = NOW() 
            WHERE id = ?
        `;
		const result = (await query(sql, [title, description, imagesJsonString, existing.id])) as any;
		return result.affectedRows > 0;
	} else {
		const newId = randomUUID();
		const sql = `
            INSERT INTO ${tableCurriculums} (id, title, description, images_json) 
            VALUES (?, ?, ?, ?)
        `;
		const result = (await query(sql, [newId, title, description, imagesJsonString])) as any;
		return result.affectedRows > 0;
	}
}
/**
 * Memperbarui teks kurikulum (Judul & Deskripsi) berdasarkan ID
 */
export async function updateCurriculumText(
	id: string,
	title: string,
	description: string
): Promise<boolean> {
	const sql = `
        UPDATE ${tableCurriculums} 
        SET title = ?, description = ?, updated_at = NOW() 
        WHERE id = ?
    `;
	const result = (await query(sql, [title, description, id])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui galeri gambar saja berdasarkan ID
 */
export async function updateCurriculumImages(id: string, images: ImageItem[]): Promise<boolean> {
	const imagesJsonString = JSON.stringify(images);
	const sql = `
        UPDATE ${tableCurriculums} 
        SET images_json = ?, updated_at = NOW() 
        WHERE id = ?
    `;
	const result = (await query(sql, [imagesJsonString, id])) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Kurikulum berdasarkan ID
 */
export async function deleteCurriculumById(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableCurriculums} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
