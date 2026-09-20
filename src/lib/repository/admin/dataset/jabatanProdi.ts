import { query } from '$lib/database/svelteDb';
import type { JabatanProdiDTO } from '$lib/dto/admin/dataset';
import { tableJabatanProdi } from '$lib/seeder/admin/dataset';

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
export async function getJabatanProdiById(id: string): Promise<JabatanProdiDTO | null> {
	const sql = `
        SELECT id, name, created_at
        FROM ${tableJabatanProdi}
        WHERE id = ?
        LIMIT 1
    `;
	const rows = (await query(sql, [id])) as JabatanProdiDTO[];
	return rows[0] || null;
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
