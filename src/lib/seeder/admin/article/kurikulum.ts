import { query } from '$lib/database/runtimeDb';
export const tableCourseMap = 'kurikulum_course_map';
export const tableObeCurriculum = 'kurikulum_obe_curriculum';

// Fungsi seed untuk tabel Peta Mata Kuliah (Peta)
export async function CourseMapTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableCourseMap} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    title VARCHAR(255) NOT NULL, -- Judul Peta Mata Kuliah (contoh: 'Peta Mata Kuliah Kurikulum Angkatan 2025 Keatas...')
    image_url VARCHAR(255) NULL, -- Link/Path foto peta mata kuliah
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Kurikulum OBE (hanya menyimpan teks HTML)
export async function ObeCurriculumTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableObeCurriculum} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    description LONGTEXT NOT NULL, -- Isi Kurikulum OBE bertipe LONGTEXT untuk menyimpan tag HTML/link unduhan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}
