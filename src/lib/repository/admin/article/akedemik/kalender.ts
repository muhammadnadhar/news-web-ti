import { query } from '$lib/database/svelteDb';
import type { AcademicCalendarDTO, CalendarImageDTO } from '$lib/dto/admin/article/akademik';
import {
	tableKalenderAkademik,
	tableKalenderAkademikImage
} from '$lib/seeder/admin/article/akademik';

// Type gabungan untuk menyajikan data Kalender beserta daftar gambarnya
export type AcademicCalendarWithImagesDTO = AcademicCalendarDTO & {
	images: CalendarImageDTO[];
};

/**
 * Mendapatkan data Kalender Akademik aktif (tanpa gambar)
 * 1 data yang di dapat
 */
export async function getActiveAcademicCalendar(): Promise<AcademicCalendarDTO | null> {
	const sql = `SELECT * FROM ${tableKalenderAkademik} WHERE is_active = TRUE LIMIT 1`;
	const rows = (await query(sql)) as AcademicCalendarDTO[];
	return rows[0] || null;
}

/**
 * Mendapatkan daftar gambar berdasarkan calendar_id
 */
export async function getCalendarImages(calendarId: string): Promise<CalendarImageDTO[]> {
	const sql = `SELECT * FROM ${tableKalenderAkademikImage} WHERE calendar_id = ? ORDER BY created_at ASC`;
	return (await query(sql, [calendarId])) as CalendarImageDTO[];
}

/**
 *Mendapatkan seluruh data Kalender Akademik yang aktif
 */
export async function getActiveAcademicCalendars(): Promise<AcademicCalendarDTO[]> {
	const sql = `
        SELECT id, title, description, is_active, created_at, updated_at 
        FROM ${tableKalenderAkademik} 
        WHERE is_active = TRUE 
        ORDER BY created_at DESC
    `;
	const rows = (await query(sql)) as AcademicCalendarDTO[];
	return rows || [];
}
/**
 * Mendapatkan seluruh data Kalender Akademik (Aktif & Non-Aktif)
 */
export async function getAllAcademicCalendars(): Promise<AcademicCalendarDTO[]> {
	const sql = `
        SELECT id, title, description, is_active, created_at, updated_at 
        FROM ${tableKalenderAkademik} 
        ORDER BY created_at DESC
    `;
	const rows = (await query(sql)) as AcademicCalendarDTO[];
	return rows || [];
}

/**
 *Mendapatkan seluruh gambar berdasarkan array calendar_id sekaligus (Batch Fetching)
 */
export async function getCalendarImagesByCalendarIds(
	calendarIds: string[]
): Promise<CalendarImageDTO[]> {
	if (!calendarIds || calendarIds.length === 0) return [];

	// Membuat placeholder (?, ?, ?) sesuai jumlah ID
	const placeholders = calendarIds.map(() => '?').join(',');
	const sql = `
        SELECT id, calendar_id, image_url 
        FROM ${tableKalenderAkademikImage} 
        WHERE calendar_id IN (${placeholders})
    `;

	const rows = (await query(sql, calendarIds)) as CalendarImageDTO[];
	return rows || [];
}

/**
 * Mendapatkan semua Kalender Akademik aktif beserta relasi gambarnya (untuk looping FormAkademik)
 */
export async function getActiveAcademicCalendarWithImages(): Promise<
	AcademicCalendarWithImagesDTO[]
> {
	//Ambil seluruh kalender
	const calendars = await getAllAcademicCalendars();
	if (!calendars || calendars.length === 0) return [];

	// Kumpulkan semua ID kalender untuk query gambar sekaligus
	const calendarIds = calendars.map((calendar) => calendar.id);
	const allImages = await getCalendarImagesByCalendarIds(calendarIds);

	// Kelompokkan dan gabungkan gambar ke masing-masing kalender
	return calendars.map((calendar) => ({
		...calendar,
		images: allImages.filter((img) => img.calendar_id === calendar.id)
	}));
}

/**
 * Mendapatkan data Kalender Akademik aktif lengkap beserta seluruh gambarnya
 */
export async function getActiveAcademicCalendarWithImage(): Promise<
	AcademicCalendarWithImagesDTO | []
> {
	const calendar = await getActiveAcademicCalendar();
	if (!calendar) return [];

	const images = await getCalendarImages(calendar.id);

	return {
		...calendar,
		images
	};
}

/**
 * Menyimpan/Memperbarui Data Utama Kalender Akademik berdasarkan ID spesifik
 */
export async function saveAcademicCalendar(
	id: string,
	title: string,
	description: string,
	is_active?: boolean
): Promise<string> {
	// Tentukan nilai default `is_active` jika tidak dikirim (undefined)
	const activeStatus = is_active ?? true;

	// Cek apakah data dengan ID ini sudah ada di database
	const checkSql = `SELECT id FROM ${tableKalenderAkademik} WHERE id = ? LIMIT 1`;
	const existing = (await query(checkSql, [id])) as AcademicCalendarDTO[];

	if (existing.length > 0) {
		// UPDATE jika ID sudah ada
		const sql = `
            UPDATE ${tableKalenderAkademik} 
            SET title = ?, description = ?, is_active = ?, updated_at = NOW() 
            WHERE id = ?
        `;
		await query(sql, [title, description, activeStatus, id]);
		return id;
	} else {
		// INSERT jika ID baru / belum ada
		const targetId = id || crypto.randomUUID();
		const sql = `
            INSERT INTO ${tableKalenderAkademik} (id, title, description, is_active) 
            VALUES (?, ?, ?, ?)
        `;
		await query(sql, [targetId, title, description, activeStatus]);
		return targetId;
	}
}

/**
 * Menghapus gambar lama milik kalender yang TIDAK ada di dalam array retainedImageIds
 */
export async function syncRetainedCalendarImages(
	calendarId: string,
	retainedImageIds: string[]
): Promise<boolean> {
	if (retainedImageIds.length === 0) {
		// Jika tidak ada gambar yang dipertahankan, hapus semua gambar milik kalender ini
		const sql = `DELETE FROM ${tableKalenderAkademikImage} WHERE calendar_id = ?`;
		await query(sql, [calendarId]);
		return true;
	}

	// Hapus gambar yang ID-nya tidak ada dalam list retainedImageIds
	const placeholders = retainedImageIds.map(() => '?').join(', ');
	const sql = `DELETE FROM ${tableKalenderAkademikImage} WHERE calendar_id = ? AND id NOT IN (${placeholders})`;
	await query(sql, [calendarId, ...retainedImageIds]);
	return true;
}
/**
 * Membuat Data Utama Kalender Akademik Baru
 * @param id UUID string unik untuk ID kalender
 * @param title Judul kalender akademik
 * @param description Deskripsi HTML/Teks dari FormEditor
 * @returns ID kalender yang berhasil dibuat
 */
export async function createAcademicCalendar(
	id: string,
	title: string,
	description: string
): Promise<string> {
	const targetId = id || crypto.randomUUID();
	// di awal is aktif selalu true , akan di ubah di bagia utama
	const sql = `INSERT INTO ${tableKalenderAkademik} (id, title, description, is_active) VALUES (?, ?, ?, TRUE)`;

	await query(sql, [targetId, title, description]);
	return targetId;
}
/**
 * Menambahkan satu gambar baru ke dalam Kalender
 */
export async function addCalendarImage(
	imageId: string,
	calendarId: string,
	imageUrl: string
): Promise<boolean> {
	const sql = `INSERT INTO ${tableKalenderAkademikImage} (id, calendar_id, image_url) VALUES (?, ?, ?)`;
	const result = (await query(sql, [imageId, calendarId, imageUrl])) as any;
	return result.affectedRows > 0;
}

/**
 * Menambahkan banyak gambar sekaligus (Bulk Insert)
 */
export async function addCalendarImages(
	images: { id: string; calendarId: string; imageUrl: string }[]
): Promise<boolean> {
	if (images.length === 0) return true;

	const valuesSql = images.map(() => '(?, ?, ?)').join(', ');
	const params = images.flatMap((img) => [img.id, img.calendarId, img.imageUrl]);

	const sql = `INSERT INTO ${tableKalenderAkademikImage} (id, calendar_id, image_url) VALUES ${valuesSql}`;
	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus data Kalender Akademik beserta seluruh relasi gambarnya
 */
export async function deleteAcademicCalendarById(calendarId: string): Promise<boolean> {
	// 1. Hapus semua gambar terkait terlebih dahulu (memanfaatkan fungsi yang sudah ada)
	await deleteAllCalendarImages(calendarId);

	// 2. Hapus data utama kalender
	const sql = `DELETE FROM ${tableKalenderAkademik} WHERE id = ?`;
	const result = (await query(sql, [calendarId])) as any;

	return result.affectedRows > 0;
}

/**
 * Menghapus satu gambar spesifik berdasarkan ID gambar
 */
export async function deleteCalendarImageById(imageId: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableKalenderAkademikImage} WHERE id = ?`;
	const result = (await query(sql, [imageId])) as any;
	return result.affectedRows > 0;
}

/**
 * Menghapus semua gambar milik Kalender tertentu
 */
export async function deleteAllCalendarImages(calendarId: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableKalenderAkademikImage} WHERE calendar_id = ?`;
	const result = (await query(sql, [calendarId])) as any;
	return result.affectedRows > 0;
}
