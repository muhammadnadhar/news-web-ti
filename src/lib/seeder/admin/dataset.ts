import { query } from '$lib/database/runtimeDb';

export const tableAngkatan = 'dataset_angkatan';
export const tableJabatanProdi = 'dataset_positions_prodi';
export const tableSemester = 'dataset_semester';
export  const tableNewsCategory = "dataset_news_kategory"

// Fungsi seed untuk tabel Angkatan
export async function AngkatanTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableAngkatan} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    year INT NOT NULL UNIQUE, -- Tahun Angkatan (contoh: 2021, 2022, 2023, 2024, dst.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Semester / Tahun Akademik (Data Semester Tahun Akademik)
export async function SemesterTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableSemester} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    name VARCHAR(100) NOT NULL, -- Nama Semester (contoh: 'Semester Ganjil 2020/2021')
    academic_year VARCHAR(20) NOT NULL, -- Tahun Ajaran menggantikan link (contoh: '2020/2021' atau 'ganjil20-21')
    is_active BOOLEAN DEFAULT FALSE, -- Penanda semester aktif (opsional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

export async function JabatanProdiTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableJabatanProdi} (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;
	await query(sql);
}

// Fungsi seed untuk tabel Kategori Berita
export async function NewsCategoryTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableNewsCategory} (
	id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
	name VARCHAR(100) NOT NULL UNIQUE, -- Nama Kategori (misal: Berita Mahasiswa, Akreditasi, Webinar)
	slug VARCHAR(100) NULL, -- URL slug opsional (misal: berita-mahasiswa)
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
	`;
	await query(sql);
}
