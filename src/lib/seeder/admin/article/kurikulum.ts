import { query } from '$lib/database/runtimeDb';
export const tableCourseMap = 'kurikulum_course_map';
export const tableCurriculums = 'kurikulum_curriculums';

// Fungsi seed untuk tabel Peta Mata Kuliah (Peta)
export async function CourseMapTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableCourseMap} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    title VARCHAR(255) NOT NULL, -- Judul Peta Mata Kuliah (contoh: 'Peta Mata Kuliah Kurikulum Angkatan 2025 Keatas...')
    image_url VARCHAR(255) NULL, -- Link/Path foto peta mata kuliah
  image_public_id VARCHAR(255) NULL, -- ID untuk Url Gambar
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Kurikulum  (hanya menyimpan teks HTML)
export async function CurriculumTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableCurriculums} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    title VARCHAR(255) NOT NULL, -- Judul Kurikulum (contoh: .')
    description LONGTEXT NOT NULL, -- Isi Kurikulum  bertipe LONGTEXT untuk menyimpan tag HTML/link unduhan
      -- Menyimpan array dari daftar gambar [{ url, public_id, caption }]
    images_json JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}
