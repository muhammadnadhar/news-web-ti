import { query } from '$lib/database/runtimeDb';
import { tableAngkatan, tableSemester } from '../dataset';
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
    image_url VARCHAR(255) NULL, -- URL/Path foto yg datap beasiswa
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
    student_name VARCHAR(255) NOT NULL, -- Nama Mahasiswa (contoh: 'Azri Ahmad Fahrozi')
    is_academic VARCHAR(10) NOT NULL DEFAULT 'y', -- Jenis prestasi Akademik (y/n)
    angkatan_id VARCHAR(36) NOT NULL, -- FK merujuk ke id tabel Angkatan
    semester_id VARCHAR(36) NOT NULL, -- FK merujuk ke id tabel Semester
    image_url VARCHAR(255) NULL,
    achievement_name TEXT NOT NULL, -- Nama Prestasi yang diraih
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key Constraints
    CONSTRAINT fk_student_achievement_angkatan 
        FOREIGN KEY (angkatan_id) REFERENCES ${tableAngkatan}(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_student_achievement_semester 
        FOREIGN KEY (semester_id) REFERENCES ${tableSemester}(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
);
  `;
	await query(sql);
}

// Fungsi seed untuk tabel Mahasiswa IPK Tertinggi (Data Mahasiswa IPK Tertinggi)
export async function HighGpaStudentTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableHighGpaStudent} (
			id VARCHAR(36) PRIMARY KEY,
			student_name VARCHAR(255) NOT NULL,
			gpa DECIMAL(3, 2) NOT NULL,
			angkatan_id VARCHAR(36) NOT NULL,
			semester_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(255)  NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			FOREIGN KEY (angkatan_id) REFERENCES ${tableAngkatan}(id) ON DELETE CASCADE,
			FOREIGN KEY (semester_id) REFERENCES ${tableSemester}(id) ON DELETE CASCADE
		);
  `;
	await query(sql);
}
