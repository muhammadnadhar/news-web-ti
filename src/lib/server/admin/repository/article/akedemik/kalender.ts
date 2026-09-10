import { tableKalenderAkademik } from '$lib/seeder/admin/article/akademik';
import { query } from '$lib/server/database/runtimeDb';
import type { AcademicCalendarDTO } from '$lib/types/admin/article/akademik';

/**
 * Mendapatkan data Kalender Akademik aktif (atau pertama)
 */
export async function getActiveAcademicCalendar(): Promise<AcademicCalendarDTO | null> {
	const sql = `SELECT * FROM ${tableKalenderAkademik} WHERE is_active = TRUE LIMIT 1`;
	const rows = (await query(sql)) as AcademicCalendarDTO[];
	return rows[0] || null;
}

/**
 * Menyimpan/Memperbarui Data Kalender Akademik
 */
export async function saveAcademicCalendar(
	id: string,
	title: string,
	description: string
): Promise<boolean> {
	const existing = await getActiveAcademicCalendar();

	if (existing) {
		const sql = `UPDATE ${tableKalenderAkademik} SET title = ?, description = ?, updated_at = NOW() WHERE id = ?`;
		const result = (await query(sql, [title, description, existing.id])) as any;
		return result.affectedRows > 0;
	} else {
		const sql = `INSERT INTO ${tableKalenderAkademik} (id, title, description, is_active) VALUES (?, ?, ?, TRUE)`;
		const result = (await query(sql, [id, title, description])) as any;
		return result.affectedRows > 0;
	}
}
