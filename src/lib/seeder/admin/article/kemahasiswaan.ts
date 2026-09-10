import { query } from '$lib/server/database/runtimeDb'; // di gunakan oleh runntime bawaah
export const tableScholarship = 'kemahasiswaan_scholarship';
export const tableStudentAchievement = 'kemahasiswaan_student_achievement';
export const tableHighGpaStudent = 'kemahasiswaan_high_gpa_student';

// Fungsi seed untuk tabel Beasiswa (Data Beasiswa Mahasiswa)
export async function ScholarshipTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableScholarship} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    student_name VARCHAR(255) NOT NULL, -- Nama mahasiswa penerima beasiswa
    scholarship_name VARCHAR(255) NOT NULL, -- Nama jenis/kategori beasiswa (contoh: 'Beasiswa Bidikmisi Tahun 2020')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Mahasiswa Prestasi (Data Mahasiswa Prestasi)
export async function StudentAchievementTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableStudentAchievement} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    student_name VARCHAR(255) NOT NULL, -- Nama Mahasiswa (contoh: 'azri ahmad fahrozi')
    is_academic VARCHAR(10) NOT NULL DEFAULT 'y', -- Jenis prestasi Akademik (y/n)
    batch_year VARCHAR(10) NOT NULL, -- Angkatan (contoh: '2020', '2021')
    semester VARCHAR(100) NOT NULL, -- Semester (contoh: 'Semester Genap 2022/2023')
    achievement_name TEXT NOT NULL, -- Nama Prestasi yang diraih
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Mahasiswa IPK Tertinggi (Data Mahasiswa IPK Tertinggi)
export async function HighGpaStudentTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableHighGpaStudent} (
    id VARCHAR(36) PRIMARY KEY, -- Primary key berupa UUID string
    student_name VARCHAR(255) NOT NULL, -- Nama Mahasiswa (contoh: 'aesha durratul nasihah')
    gpa DECIMAL(3, 2) NOT NULL, -- Nilai IPK (contoh: 3.79, 3.95)
    batch_year VARCHAR(10) NOT NULL, -- Angkatan (contoh: '2020')
    semester VARCHAR(50) NOT NULL, -- Semester (contoh: '2020')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan data
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update data
);
  `;
	await query(sql);
}
