import { query } from '$lib/server/database/runtimeDb'; // di gunakan oleh runntime bawaah
export const tableNews = 'berita';

// Fungsi seed untuk tabel Berita (Data Berita)
export async function NewsTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableNews} (
    id VARCHAR(36) PRIMARY KEY, -- Menggunakan UUID string
    title VARCHAR(255) NOT NULL, -- Judul Berita
    category VARCHAR(100) NOT NULL, -- Kategori Berita (misal: Berita Mahasiswa, Berita Prodi, Akreditasi, Seminar, HIMA-TI, Webinar)
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Tanggal Berita (termasuk jam)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Tanggal data dibuat
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Tanggal pembaruan data
);
  `;
	await query(sql);
}
