import { query } from '$lib/database/svelteDb';
import type { PrimaryDosenDTO } from '$lib/dto/admin/home';
import { tableLecturerStaff } from '$lib/seeder/admin/article/profile';
import { tableDosenPrimary, tablePerminatanTI, tableProfilProdi } from '$lib/seeder/admin/home';

//  Simpan Dosen Primary
export async function createDosenPrimary(
	id: string,
	data: { lecturer_staff_id: string; position: string }
) {
	const sql = `
        INSERT INTO ${tableDosenPrimary} (id, lecturer_staff_id, position)
        VALUES (?, ?, ?)
    `;
	await query(sql, [id, data.lecturer_staff_id, data.position]);
}

/**
 * mendapatkan 3 dosen primary lengkap dengan detail dari tabel main (join)
 */
export async function getPrimaryDosenList(): Promise<PrimaryDosenDTO[]> {
	const sql = `
        SELECT 
            dp.id AS primary_id,
            dp.lecturer_staff_id,
            dp.position,
            ls.name,
            ls.nidn,
            ls.expertise,
            ls.photo_url,
            ls.pddikti_url
        FROM ${tableDosenPrimary} dp
        INNER JOIN ${tableLecturerStaff} ls ON dp.lecturer_staff_id = ls.id
        ORDER BY dp.created_at ASC
    `;
	const rows = (await query(sql)) as PrimaryDosenDTO[];
	return rows;
}

/**
 * UPDATE/GANTI DOSEN PILIHAN PADA SLOT PRIMARY
 */
export async function updatePrimaryDosenSlot(
	primaryId: string,
	lecturerStaffId: string,
	position?: string
): Promise<boolean> {
	let sql = `UPDATE ${tableDosenPrimary} SET lecturer_staff_id = ?`;
	const params: any[] = [lecturerStaffId];

	if (position) {
		sql += `, position = ?`;
		params.push(position);
	}

	sql += ` WHERE id = ?`;
	params.push(primaryId);

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}
