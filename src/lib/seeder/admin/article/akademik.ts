import { query } from '$lib/database/runtimeDb';

export const tablePedomanTa = 'akademik_pedoman_ta';
export const tablePedomanKkp = 'akademik_pedoman_kkp';
export const tableRecruitment = 'akademik_recruitment';
export const tablePracticumModule = 'akademik_practicum_module';

// ini table terpisah yang menyimpan data gambar
export const tableKalenderAkademik = 'akademik_kalender_akademik';
export const tableKalenderAkademikImage = 'akademik_kalendar_images'; // punya forengkey ke table kelender Akademik

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
/**
 * Seed Tabel Utama: Kalender Akademik
 */
export async function AcademicCalendarTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableKalenderAkademik} (
    id VARCHAR(36) PRIMARY KEY,                             -- UUID String
    title VARCHAR(255) NOT NULL,                           -- Judul Kalender
    description LONGTEXT NULL,                             -- Deskripsi HTML/Teks
    is_active BOOLEAN DEFAULT TRUE,                        -- Status aktif
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,        -- Waktu Dibuat
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu Diperbarui
);
  `;
	await query(sql);
}

/**
 *  Seed Tabel Gambar: Gambar Kalender Akademik
 * Sesuai dengan CalendarImageDTO
 */
export async function CalendarImageTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableKalenderAkademikImage} (
    id VARCHAR(36) PRIMARY KEY,                             -- UUID String
    calendar_id VARCHAR(36) NOT NULL,                       -- Foreign Key ke tabel Kalender
    image_url VARCHAR(255) NULL,                                -- Path / URL Gambar
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- (Opsional) Mengetahui waktu upload
    
    -- Relasi Foreign Key
    CONSTRAINT fk_calendar_images_calendar_id
        FOREIGN KEY (calendar_id) 
        REFERENCES ${tableKalenderAkademik}(id) 
        ON DELETE CASCADE                                  -- Hapus gambar otomatis jika kalender dihapus
        ON UPDATE CASCADE
);
  `;
	await query(sql);
}
