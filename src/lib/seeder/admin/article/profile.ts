import { query } from "$lib/database/runtimeDb";
// sejarah
export const tableSejarahContent = 'profile_sejarah_content';
export const tableSejarahLeaders = 'profile_sejarah_leaders';

export const tableVisiMisi = 'profile_visi_misi';
export const tableOrganizationalStructure = 'profile_organizational_structure';
export const tableLecturerStaff = 'profile_lecturer_staff';
export const tableAccreditation = 'profile_accreditation';

//  Tabel untuk menyimpan konten teks Sejarah Prodi & Foto
export async function HistoryContentTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableSejarahContent} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    title VARCHAR(255) NOT NULL, -- Judul Sejarah (contoh: 'Sejarah')
    image_url VARCHAR(255) NULL, -- URL/Path foto gedung/prodi
    description LONGTEXT NULL, -- Isi teks sejarah lengkap (support HTML dari Rich Text Editor)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);

  `;
	await query(sql);
}

// Tabel untuk menyimpan Data Sejarah Pimpinan Jurusan berdasarkan Periode
export async function HistoryLeadersTableSeed() {
    const sql = `
CREATE TABLE IF NOT EXISTS ${tableSejarahLeaders} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    period VARCHAR(100) NOT NULL, -- Periode Jabatan (contoh: '2018 - 2022')
    
    -- Foreign Key merujuk ke tabel Dosen & Staff
    head_id VARCHAR(36) NULL, -- Referensi ke ID Ketua (LecturerStaff)
    secretary_id VARCHAR(36) NULL, -- Referensi ke ID Sekretaris (LecturerStaff)
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Constraint Foreign Key
    CONSTRAINT fk_history_leaders_head 
        FOREIGN KEY (head_id) REFERENCES ${tableLecturerStaff}(id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
        
    CONSTRAINT fk_history_leaders_secretary 
        FOREIGN KEY (secretary_id) REFERENCES ${tableLecturerStaff}(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
);`;

    await query(sql);
}

// Fungsi seed untuk tabel Visi Misi (hanya menyimpan teks HTML)
export async function VisiMisiTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableVisiMisi} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    content LONGTEXT NOT NULL, -- Isi Visi Misi bertipe LONGTEXT untuk menyimpan seluruh struktur tag HTML
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Struktur Organisasi (Data Struktur Organisasi)
export async function OrganizationalStructureTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableOrganizationalStructure} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    title VARCHAR(255) NOT NULL, -- Judul Struktur Organisasi (misal: 'Struktur Organisasi Prodi Teknologi Informasi')
    image_url VARCHAR(255) NULL, -- URL/Link gambar bagan struktur organisasi
    description TEXT NULL, -- Deskripsi bertipe TEXT biasa (menampung teks polos)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Dosen & Staff (Data Dosen & Staff)
export async function LecturerStaffTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableLecturerStaff} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    name VARCHAR(255) NOT NULL, -- Nama lengkap beserta gelar (contoh: 'Aulia Syarif Aziz, S.Kom., M.Sc')
    nidn VARCHAR(50) NULL, -- NIDN / NIP (bisa NULL / '-' jika Staff Administrasi)
    pddikti_url VARCHAR(255) NULL, -- Link PDDikti / DDT
    expertise VARCHAR(150) NOT NULL, -- Bidang keahlian/tugas (contoh: 'Keamanan Siber', 'Staff Administrasi')
    role ENUM('Dosen', 'Staff') NOT NULL DEFAULT 'Dosen', -- Penanda jenis: 'Dosen' atau 'Staff'
    is_primary BOOLEAN NOT NULL DEFAULT FALSE, -- Penanda data utama yang tampil di Home (true/false)
    photo_url VARCHAR(255) NULL, -- URL/Path foto profil (opsional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
`;
	await query(sql);
}

// Fungsi seed untuk tabel Akreditasi (hanya menyimpan Foto dan Isi Teks HTML)
export async function AccreditationTableSeed() {
	const sql = `CREATE TABLE IF NOT EXISTS ${tableAccreditation} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    image_url VARCHAR(255) NULL, -- URL/Path foto sertifikat akreditasi
    description LONGTEXT NOT NULL, -- Isi Teks Akreditasi (menampung tag HTML / Rich Text)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
  )`;

	await query(sql);
}
