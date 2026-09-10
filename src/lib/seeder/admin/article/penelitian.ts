import { query } from '$lib/server/database/runtimeDb'; // di gunakan oleh runntime bawaah

export const tableLecturerPublication = 'penelitian_lecturer_publication';
export const tableStudentPublication = 'penelitian_student_publication';
export const tableLecturerResearch = 'penelitian_lecturer_research';

// Fungsi seed untuk tabel Publikasi Dosen (Data Publikasi Dosen)
export async function LecturerPublicationTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableLecturerPublication} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    lecturer_name VARCHAR(255) NOT NULL, -- Nama lengkap dosen beserta gelar (contoh: 'Aulia Syarif Aziz, S.Kom., M.Sc')
    sinta_link VARCHAR(255) NULL, -- URL profil SINTA dosen
    scholar_link VARCHAR(255) NULL, -- URL profil Google Scholar dosen
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Publikasi Mahasiswa (Data Publikasi Mahasiswa)
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
