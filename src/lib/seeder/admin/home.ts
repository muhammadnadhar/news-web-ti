import { query } from "$lib/server/database/runtimeDb";

export const tableDosen = "home_dosen"
export const tablePerminatanTI = "home_perminatan"
export const tableProfilProdi = "home_profilProdi"
/*
 * semua daftar dosen di simpan di sni 
 */
export async function DosenTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableDosen} (
    id VARCHAR(36) PRIMARY KEY, -- Primary Key UUID String
    name VARCHAR(150) NOT NULL, -- Nama Dosen beserta Gelar
    position VARCHAR(100) NOT NULL, -- Jabatan (e.g. 'Ketua Prodi Teknologi Informasi')
    image_url VARCHAR(255) NOT NULL, -- Path/URL foto profil dosen
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
  `;
	await query(sql);
}


// table untuk menyimpan semua perminatan ti
export async function PerminatanTITableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tablePerminatanTI} (
    id VARCHAR(36) PRIMARY KEY, -- Primary Key UUID String
    title VARCHAR(150) NOT NULL, -- Judul Perminatan (e.g. 'Kecerdasan Buatan')
    description TEXT NOT NULL, -- Deskripsi lengkap perminatan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
  `;
	await query(sql);
}


// table untk menyimpan barqoute dan description 
export async function ProfilProdiTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableProfilProdi} (
    id VARCHAR(36) PRIMARY KEY, -- Primary Key UUID String
    title VARCHAR(255) NOT NULL, -- Judul Halaman Profil (e.g. 'Profil Program Studi Teknologi Informasi')
    description TEXT NOT NULL, -- Isi deskripsi/profil prodi
    image_url VARCHAR(255) NULL, -- Path/URL foto/QR pengaduan yang diunggah
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
  `;
	await query(sql);
}
