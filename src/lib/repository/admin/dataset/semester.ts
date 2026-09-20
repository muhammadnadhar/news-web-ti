import { query } from '$lib/database/svelteDb';
import type { SemesterDTO } from '$lib/dto/admin/dataset';
import { tableSemester } from '$lib/seeder/admin/dataset';

/**
 * Mengambil semua data semester (diurutkan dari yang terbaru dibuat)
 */
export async function getAllSemesters(): Promise<SemesterDTO[]> {
	const sql = `
		SELECT 
			id, 
			name, 
			academic_year, 
			is_active, 
			created_at, 
			updated_at 
		FROM ${tableSemester} 
		ORDER BY created_at DESC
	`;
	const rows = (await query(sql)) as any[];

	// Konversi nilai integer MySQL (1/0) ke tipe boolean
	return rows.map((row) => ({
		...row,
		is_active: Boolean(row.is_active)
	}));
}

/**
 * Mengambil detail semester berdasarkan ID
 */
export async function getSemesterById(id: string): Promise<SemesterDTO | null> {
	const sql = `
		SELECT 
			id, 
			name, 
			academic_year, 
			is_active, 
			created_at, 
			updated_at 
		FROM ${tableSemester} 
		WHERE id = ? 
		LIMIT 1
	`;
	const rows = (await query(sql, [id])) as any[];

	if (!rows || rows.length === 0) return null;

	return {
		...rows[0],
		is_active: Boolean(rows[0].is_active)
	};
}

/**
 * 3. Mengambil semester yang sedang aktif (is_active = true)
 */
export async function getActiveSemester(): Promise<SemesterDTO | null> {
	const sql = `
		SELECT 
			id, 
			name, 
			academic_year, 
			is_active, 
			created_at, 
			updated_at 
		FROM ${tableSemester} 
		WHERE is_active = TRUE 
		LIMIT 1
	`;
	const rows = (await query(sql)) as any[];

	if (!rows || rows.length === 0) return null;

	return {
		...rows[0],
		is_active: Boolean(rows[0].is_active)
	};
}

/**
 * 4. Membuat semester baru
 * Jika `is_active` bernilai true, otomatis menonaktifkan semester lain.
 */
export async function createSemester(
	id: string,
	name: string,
	academicYear: string,
	isActive: boolean = false
): Promise<boolean> {
	// Jika semester baru diset aktif, nonaktifkan semester lainnya terlebih dahulu
	if (isActive) {
		await deactivateAllSemesters();
	}

	const sql = `
		INSERT INTO ${tableSemester} (id, name, academic_year, is_active) 
		VALUES (?, ?, ?, ?)
	`;
	const result = (await query(sql, [id, name, academicYear, isActive])) as any;

	return result.affectedRows > 0;
}

/**
 * 5. Mengubah data semester berdasarkan ID
 */
export async function updateSemester(
	id: string,
	name: string,
	academicYear: string,
	isActive: boolean = false
): Promise<boolean> {
	// Jika diset sebagai aktif, nonaktifkan semester lainnya terlebih dahulu
	if (isActive) {
		await deactivateAllSemesters();
	}

	const sql = `
		UPDATE ${tableSemester} 
		SET name = ?, academic_year = ?, is_active = ? 
		WHERE id = ?
	`;
	const result = (await query(sql, [name, academicYear, isActive, id])) as any;

	return result.affectedRows > 0;
}

/**
 * 6. Mengaktifkan satu semester tertentu & otomatis menonaktifkan semester lainnya
 */
export async function setActiveSemester(id: string): Promise<boolean> {
	// 1. Nonaktifkan semua semester
	await deactivateAllSemesters();

	// 2. Aktifkan semester terpilih
	const sql = `
		UPDATE ${tableSemester} 
		SET is_active = TRUE 
		WHERE id = ?
	`;
	const result = (await query(sql, [id])) as any;

	return result.affectedRows > 0;
}

/**
 * 7. Helper: Menonaktifkan semua semester (Internal/Private use)
 */
export async function deactivateAllSemesters(): Promise<void> {
	const sql = `UPDATE ${tableSemester} SET is_active = FALSE`;
	await query(sql);
}

/**
 * 8. Menghapus data semester berdasarkan ID
 */
export async function deleteSemester(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableSemester} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;

	return result.affectedRows > 0;
}
