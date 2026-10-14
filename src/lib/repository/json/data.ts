import fs from 'node:fs/promises';
import { DATAUI } from '$lib/constants';
import { DATAUI as DATAUIENV } from '$env/static/private';
import path from 'node:path';

/**
 * Fungsi untuk memastikan folder 'data' dan file 'action-links.json' ada.
 * Jika belum ada, otomatis membuat folder dan file JSON dengan data default.
 * @param defaultData : di sini akan mendadatakan Type dari setiap data JSON default baru
 */
export async function ensureJsonFileExists<defaultData>(
	file: string,
	defaultData: defaultData[] | null
): Promise<void> {
	try {
		await fs.access(DATAUIENV ?? DATAUI);
	} catch {
		await fs.mkdir(DATAUIENV ?? DATAUI, { recursive: true });
	}

	try {
		await fs.access(file);
	} catch {
		// Jika belum ada, tulis file JSON baru menggunakan data default
		const dataString = JSON.stringify(defaultData, null, 2);
		await fs.writeFile(file, dataString, 'utf-8');
	}
}

//
// /**
//  * Fungsi untuk menulis ulang atau memperbarui file JSON dengan data baru.
//  *
//  * @param file - Path lengkap file JSON yang akan ditulis.
//  * @param data - Data baru (bisa berupa array atau objek) yang akan disimpan.
//  */
// export async function writeJsonFile<T>(file: string, data: T): Promise<void> {
// 	try {
// 		// Pastikan folder utamanya ada terlebih dahulu (mengantisipasi jika folder terhapus)
// 		await fs.access(DATAUIENV ?? DATAUI);
// 	} catch {
// 		await fs.mkdir(DATAUIENV ?? DATAUI, { recursive: true });
// 	}
//
// 	// Tulis atau Timpa (Overwrite) isi file JSON dengan data terbaru
// 	await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
// }
/**
 * Membaca file JSON dengan validasi keberadaan file.
 * Jika file tidak ditemukan atau error saat parse, mengembalikan fallback value.
 */
export async function readJsonFile<T>(
	filePath: string,
	fallback: T | null = null
): Promise<T | null> {
	try {
		// Cek apakah file ada
		await fs.access(filePath);

		const fileContent = await fs.readFile(filePath, 'utf-8');
		if (!fileContent.trim()) {
			return fallback;
		}

		return JSON.parse(fileContent) as T;
	} catch (error: any) {
		// Jika file tidak ada (ENOENT) atau JSON parse error, kembalikan fallback
		if (error.code === 'ENOENT') {
			console.warn(`[readJsonFile] File tidak ditemukan: ${filePath}. Menggunakan fallback.`);
		} else {
			console.error(`[readJsonFile] Gagal membaca/parse JSON dari ${filePath}:`, error);
		}
		return fallback;
	}
}

/**
 * Memperbarui data JSON dengan membaca data lama terlebih dahulu,
 * melakukan mapping/update melalui callback, lalu menulis ulang seluruh datanya.
 */
export async function writeJsonFile<T>(
	filePath: string,
	updateFn: (existingData: T | null) => T,
	fallbackExisting: T | null = null
): Promise<void> {
	try {
		const existingData = await readJsonFile<T>(filePath, fallbackExisting);

		const updatedData = updateFn(existingData);

		const dir = path.dirname(filePath);
		await fs.mkdir(dir, { recursive: true });

		await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');
	} catch (error) {
		console.error(`[writeJsonFile] Gagal memperbarui file JSON ${filePath}:`, error);
		throw error;
	}
}

/**
 * Menghapus data dari file JSON dengan membaca data lama,
 * melakukan filtering melalui callback, lalu menulis ulang hasilnya.
 */
export async function deleteFromJsonFile<T>(
	filePath: string,
	filterFn: (existingData: T) => T,
	fallbackExisting: T | null = null
): Promise<void> {
	try {
		// 1. Baca data yang ada saat ini
		const existingData = await readJsonFile<T>(filePath, fallbackExisting);

		if (!existingData) {
			console.warn(
				`[deleteFromJsonFile] File kosong atau tidak ada, tidak ada yang dapat dihapus di ${filePath}.`
			);
			return;
		}

		const updatedData = filterFn(existingData);

		const dir = path.dirname(filePath);
		await fs.mkdir(dir, { recursive: true });

		await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');
	} catch (error) {
		console.error(`[deleteFromJsonFile] Gagal menghapus data dari file JSON ${filePath}:`, error);
		throw error;
	}
}
