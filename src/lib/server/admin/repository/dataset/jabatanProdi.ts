import { tableJabatanProdi } from '$lib/seeder/admin/dataset';
import { query } from '$lib/server/database/svelteDb';
import type { JabatanProdiDTO } from '$lib/types/admin/dataset';

// Ambil semua daftar Jabatan Prodi
export async function getJabatanProdiList(): Promise<JabatanProdiDTO[]> {
	const sql = `
        SELECT id, name
        FROM ${tableJabatanProdi}
        ORDER BY name ASC
    `;
	const rows = await query(sql);
	return rows as JabatanProdiDTO[];
}

export async function getAllJabatanProdi(): Promise<JabatanProdiDTO[]> {
	const sql = `
        SELECT id, name, created_at 
        FROM ${tableJabatanProdi} 
        ORDER BY name ASC
    `;
	const rows = await query(sql);
	return rows as JabatanProdiDTO[];
}

export async function createJabatanProdi(id: string, name: string) {
	const sql = `INSERT INTO ${tableJabatanProdi} (id, name) VALUES (?, ?)`;
	await query(sql, [id, name]);
}

export async function updateJabatanProdi(id: string, name: string) {
	const sql = `UPDATE ${tableJabatanProdi} SET name = ? WHERE id = ?`;
	await query(sql, [name, id]);
}

export async function deleteJabatanProdi(id: string) {
	const sql = `DELETE FROM ${tableJabatanProdi} WHERE id = ?`;
	await query(sql, [id]);
}
