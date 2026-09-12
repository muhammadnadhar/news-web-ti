import { tablePartnership } from '$lib/seeder/admin/article/kerjasama';
import type { PartnershipDTO } from '$lib/types/admin/article/kerjasama';
import { query } from '$lib/server/database/svelteDb';

/**
 * Mengambil seluruh data Daftar Kerjasama
 */
export async function getAllPartnerships(): Promise<PartnershipDTO[]> {
	const sql = `SELECT * FROM ${tablePartnership} ORDER BY created_at DESC`;
	return (await query(sql)) as PartnershipDTO[];
}

/**
 * Mengambil 1 data Daftar Kerjasama berdasarkan ID
 */
export async function getPartnershipById(id: string): Promise<PartnershipDTO | null> {
	const sql = `SELECT * FROM ${tablePartnership} WHERE id = ? LIMIT 1`;
	const rows = (await query(sql, [id])) as PartnershipDTO[];
	return rows[0] || null;
}

/**
 * Membuat data Daftar Kerjasama baru
 */
export async function createPartnership(
	id: string,
	institutionName: string,
	logoUrl: string | null
): Promise<boolean> {
	const sql = `INSERT INTO ${tablePartnership} (id, institution_name, logo_url) VALUES (?, ?, ?)`;
	const result = (await query(sql, [id, institutionName, logoUrl || null])) as any;
	return result.affectedRows > 0;
}

/**
 * Memperbarui data Daftar Kerjasama
 */
export async function updatePartnership(
	id: string,
	institutionName: string,
	logoUrl: string | null
): Promise<boolean> {
	const sql = `UPDATE ${tablePartnership} SET institution_name = ?, logo_url = ?, updated_at = NOW() WHERE id = ?`;
	const result = (await query(sql, [institutionName, logoUrl || null, id])) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Daftar Kerjasama
 */
export async function deletePartnership(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tablePartnership} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}
