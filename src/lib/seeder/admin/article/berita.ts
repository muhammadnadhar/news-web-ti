import { query } from "$lib/database/runtimeDb";
import { tableNewsCategory } from "../dataset";

export const tableNews = 'berita';

// Fungsi seed untuk tabel Berita (Data Berita)
export async function NewsTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableNews} (
	id VARCHAR(36) PRIMARY KEY, -- Menggunakan UUID string
	title VARCHAR(255) NOT NULL, -- Judul Berita
	category_id VARCHAR(36) NOT NULL, -- Foreign Key merujuk ke tabel Kategori Berita
	content TEXT NOT NULL, -- Isi Konten Berita
	image_url VARCHAR(255) NULL, -- URL Gambar Berita
	published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Tanggal Berita (termasuk jam)
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Tanggal data dibuat
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Tanggal pembaruan data

	CONSTRAINT fk_news_category
		FOREIGN KEY (category_id) 
		REFERENCES ${tableNewsCategory}(id) 
		ON DELETE CASCADE
);
	`;
	await query(sql);
}
