import { tableLecturerStaff } from '$lib/seeder/admin/article/profile';
import { tableWellcomeKaprodi } from '$lib/seeder/admin/home';
import { query } from '$lib/database/svelteDb';
import type { DosenWellcomeDTO } from '$lib/dto/admin/home';
import { randomUUID } from '$lib/crypto';

// Ambil data Wellcome pertama beserta detail dosennya (tanpa is_active)
export async function getDosenWellcome(): Promise<DosenWellcomeDTO | null> {
	const sql = `
        SELECT ds.id, ds.lecturer_staff_id, ds.title, ds.welcome_message, 
               ls.name, ls.nidn, ls.photo_url
        FROM ${tableWellcomeKaprodi} ds
        JOIN ${tableLecturerStaff} ls ON ds.lecturer_staff_id = ls.id
        LIMIT 1;
    `;
	const rows = (await query(sql)) as DosenWellcomeDTO[];
	return rows.length > 0 ? rows[0] : null;
}

// Ambil data Wellcome berdasarkan ID spesifik untuk halaman edit
export async function getDosenWellcomeById(id: string): Promise<DosenWellcomeDTO | null> {
	const sql = `
        SELECT ds.id, ds.lecturer_staff_id, ds.title, ds.welcome_message, 
               ls.name, ls.nidn, ls.photo_url
        FROM ${tableWellcomeKaprodi} ds
        JOIN ${tableLecturerStaff} ls ON ds.lecturer_staff_id = ls.id
        WHERE ds.id = ?
        LIMIT 1;
    `;
	const rows = (await query(sql, [id])) as DosenWellcomeDTO[];
	return rows.length > 0 ? rows[0] : null;
}

// Ambil daftar semua dosen/staff untuk pilihan dropdown select
export async function getLecturerStaffList() {
	const sql = `SELECT id, name, nidn FROM ${tableLecturerStaff} ORDER BY name ASC`;
	return await query(sql);
}

// Update data Wellcome berdasarkan ID spesifik
export async function updateDosenWellcome(
	id: string,
	data: {
		lecturer_staff_id: string;
		title: string;
		welcome_message: string;
	}
) {
	const sql = `
        UPDATE ${tableWellcomeKaprodi} 
        SET lecturer_staff_id = ?, title = ?, welcome_message = ?, updated_at = NOW()
        WHERE id = ?;
    `;
	await query(sql, [data.lecturer_staff_id, data.title, data.welcome_message, id]);
}

// Tambah atau Update (Upsert) data Wellcome secara otomatis
export async function upsertDosenWellcome(data: {
	lecturer_staff_id: string;
	title: string;
	welcome_message: string;
}) {
	const existing = (await query(`SELECT id FROM ${tableWellcomeKaprodi} LIMIT 1;`)) as any[];

	if (existing.length > 0) {
		await updateDosenWellcome(existing[0].id, data);
	} else {
		const id = randomUUID();
		const sql = `
            INSERT INTO ${tableWellcomeKaprodi} (id, lecturer_staff_id, title, welcome_message)
            VALUES (?, ?, ?, ?);
        `;
		await query(sql, [id, data.lecturer_staff_id, data.title, data.welcome_message]);
	}
}
