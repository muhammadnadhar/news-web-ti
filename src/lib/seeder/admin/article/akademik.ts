import { query } from '$lib/server/db';

export const tablePedomanTa = 'pedoman_ta';
export const tablePedomanKkp = 'pedoman_kkp';
export const tableRecruitment = 'recruitment';
export const tablePracticumModule = 'practicum_module';
// ini table terpisah yang menyimpan data gambar
export const tableKalenderAkademik = 'kalender_akademik';

// Fungsi seed untuk tabel Pedoman Tugas Akhir
export async function PedomanTaTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tablePedomanTa} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    title VARCHAR(255) NOT NULL, -- Judul Pedoman TA
    image_url VARCHAR(255) NULL, -- URL/Link foto sampul pedoman
    description TEXT NULL, -- Deskripsi lengkap atau ringkasan pedoman
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Pedoman Kuliah Kerja Praktek (Data Pedoman KKP)
export async function PedomanKkpTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tablePedomanKkp} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    title VARCHAR(255) NOT NULL, -- Judul Pedoman KKP
    image_url VARCHAR(255) NULL, -- URL/Link foto sampul pedoman
    description LONGTEXT NULL, -- Deskripsi bertipe LONGTEXT untuk menyimpan format Rich Text / Tag HTML
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Rekruitmen (Data Ketentuan Rekrutmen Asisten Lab TI)
export async function RecruitmentTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableRecruitment} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    title VARCHAR(255) NOT NULL, -- Judul Rekrutmen / Ketentuan
    image_url VARCHAR(255) NULL, -- URL/Link foto pendukung
    description LONGTEXT NULL, -- Deskripsi bertipe LONGTEXT untuk menampung tag HTML
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Modul Praktikum (Data Modul Praktikum)
export async function PracticumModuleTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tablePracticumModule} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    title VARCHAR(255) NOT NULL, -- Judul Modul Praktikum (contoh: 'Modul Praktikum Semester Ganjil')
    image_url VARCHAR(255) NULL, -- URL/Link foto pendukung
    description LONGTEXT NULL, -- Deskripsi bertipe LONGTEXT untuk menampung format tabel / tag HTML
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Kalender Akademik (Data Kalender Akademik)
export async function AcademicCalendarTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableKalenderAkademik} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    title VARCHAR(255) NOT NULL, -- Judul Kalender Akademik (contoh: 'Kalender Akademik T.A 2025/2026')
    description LONGTEXT NULL, -- Deskripsi/Tabel Kalender Akademik bertipe LONGTEXT (menampung tag HTML/Tabel)
    is_active BOOLEAN DEFAULT TRUE, -- Status aktif/tidaknya kalender yang sedang berlaku
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}
