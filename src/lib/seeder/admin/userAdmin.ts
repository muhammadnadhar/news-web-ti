import { query } from '$lib/server/db';
import type { UserAdminItem } from '$lib/types/admin/user';

export const tableAdminUser = 'usersAdmin';

// user yang di buat di sini adalah admin
export async function UserTableSeed() {
	const sql = `
CREATE TABLE IF NOT EXISTS ${tableAdminUser}(
    id VARCHAR(36) PRIMARY KEY, -- Menggunakan VARCHAR(36) jika ID berupa UUID string
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Administrator', 'Dosen', 'Operator', 'Mahasiswa')),
    status VARCHAR(15) NOT NULL CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Diubah ke snake_case agar sesuai best practice database
);
  `;
	await query(sql);
}
/**
 * Memasukkan data user default/seed ke dalam database secara bulk
 * @param {UserAdminItem[]} data - Array berisi data user default
 */
export async function defaultUsersData(data: UserAdminItem[]) {
	if (!data || data.length === 0) return;

	// Transformasikan array objek menjadi array kontainer nilai
	const values = data.map((user) => [
		user.id,
		user.name,
		user.username,
		user.role,
		user.status,
		user.createdAt
	]);

	// Menggunakan klausa 'AS new_data' agar kompatibel dengan MySQL 8+ / MariaDB modern
	const sql = `
		INSERT INTO ${tableAdminUser} (id, name, username, role, status, created_at) 
		VALUES ?
		ON DUPLICATE KEY UPDATE 
			name = VALUES(name),
			username = VALUES(username),
			role = VALUES(role),
			status = VALUES(status)
	`;

	try {
		// Tetap bungkus 'values' di dalam array baru [values]
		const result = await query(sql, [values]);
		console.log(`Berhasil memproses bulk insert untuk ${data.length} user.`);
		return result;
	} catch (error) {
		console.error('Gagal memasukkan data default user:', error);
		throw error;
	}
}

