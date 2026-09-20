import { tableLecturerStaff } from './article/profile';
import { query } from '$lib/database/runtimeDb';

export const tableProfileDashboard = 'home_profileDashboard';
export const tableDosenPrimary = 'home_dosenPrimary';
export const tablePerminatanTI = 'home_perminatan';
export const tableProfilProdi = 'home_profilProdi';

/** seeder / create table profile dashboard */
export async function ProfileDashboardTableSeed() {
	const sql = `
        CREATE TABLE IF NOT EXISTS ${tableProfileDashboard} (
            id VARCHAR(36) PRIMARY KEY, -- Primary Key UUID String
            title VARCHAR(150) NOT NULL, -- Judul text yang muncul setiap gambar
            image_path VARCHAR(255) NOT NULL, -- Path URL ke file img yg di simpan
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `;
	await query(sql);
}

/*
 * dosen utama yang akan di tampilkan di sini
 * ini ambil dari daftar table dosen dan staff yg nantinya ada penandanya cek di profile
 */
export async function DosenPrimaryTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableDosenPrimary} (
    id VARCHAR(36) PRIMARY KEY, -- ID unik baris primary slot
    lecturer_staff_id VARCHAR(36) NOT NULL, -- Foreign Key ke tabel profile_lecturer_staff
    position VARCHAR(100) NOT NULL, -- Jabatan (e.g. 'Ketua Prodi', 'Sekretaris Prodi')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_dosen_primary_staff 
        FOREIGN KEY (lecturer_staff_id) 
        REFERENCES ${tableLecturerStaff}(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
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
// nantik profile profile yang bsia di tambhakan tambhakna di sini
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
