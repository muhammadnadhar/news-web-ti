import { query } from '$lib/database/runtimeDb';

export const tablePartnership = 'kerjasama_partnership';
export const tableActivityDocumentation = 'kerjasama_activity_documentation';

// Fungsi seed untuk tabel Daftar Kerjasama (Data Kerjasama / Mitraship)
export async function PartnershipTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tablePartnership} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    institution_name VARCHAR(255) NOT NULL, -- Nama Instansi / Mitra Kerjasama (contoh: 'Bank Indonesia', 'Forum Konservasi Leuser')
    logo_url VARCHAR(255) NULL, -- URL/Path foto logo instansi mitra
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Dokumentasi Kegiatan
export async function ActivityDocumentationTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableActivityDocumentation} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    title VARCHAR(255) NOT NULL, -- Judul Kegiatan / Nama Dokumentasi
    image_url VARCHAR(255) NULL, -- URL/Path foto atau media dokumentasi kegiatan
    link_drive TEXT NULL,
    description TEXT NULL, -- Deskripsi singkat kegiatan (opsional, teks polos)
    event_date DATE NULL, -- Tanggal pelaksanan kegiatan (opsional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}
