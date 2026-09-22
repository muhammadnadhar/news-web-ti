import { query } from '$lib/database/runtimeDb';
import { tableLecturerStaff } from './profile';
export const tableLecturerPublication = 'penelitian_lecturer_publication';
export const tableStudentPublication = 'penelitian_student_publication';
export const tableLecturerResearch = 'penelitian_lecturer_research';

// Fungsi seed untuk tabel Publikasi Dosen (Data Publikasi Dosen)
export async function LecturerPublicationTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableLecturerPublication} (
	id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
	lecturer_id VARCHAR(36) NOT NULL, -- Foreign key ke tabel dosen
	sinta_link VARCHAR(255) NULL, -- URL profil SINTA dosen
	scholar_link VARCHAR(255) NULL, -- URL profil Google Scholar dosen
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Waktu update data

	CONSTRAINT fk_lecturer_publication_staff 
		FOREIGN KEY (lecturer_id) 
		REFERENCES ${tableLecturerStaff}(id) 
		ON DELETE CASCADE
);
	`;
	await query(sql);
} // Fungsi seed untuk tabel Publikasi Mahasiswa (Data Publikasi Mahasiswa)
export async function StudentPublicationTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableStudentPublication} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    student_name VARCHAR(255) NOT NULL, -- Nama mahasiswa (contoh: 'Aulia Sabri')
    journal_list LONGTEXT NOT NULL, -- Daftar jurnal bertipe LONGTEXT (menampung tag list HTML <ul><li>/link)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Penelitian Dosen Prodi TI (hanya menyimpan teks HTML)
export async function LecturerResearchTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableLecturerResearch} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    description LONGTEXT NOT NULL, -- Isi Penelitian Dosen bertipe LONGTEXT untuk menampung format list/tag HTML & link rekapitulasi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}
