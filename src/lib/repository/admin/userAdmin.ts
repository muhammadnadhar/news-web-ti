import { query } from "$lib/database/svelteDb";
import type { UserAdminDTO } from "$lib/dto/admin/userAdmin";
import { tableAdminUser } from "$lib/seeder/admin/userAdmin";

// Tipe data parsial untuk operasi update (agar kolom yang diupdate bersifat opsional)
export type UpdateUserData = Partial<Omit<UserAdminDTO, 'id' | 'createdAt'>>;

/*
 * Tambah User Admin Baru
 */
export async function createUserAdmin(
	userData: Omit<UserAdminDTO, 'createdAt'>
): Promise<boolean> {
	const sql = `
		INSERT INTO ${tableAdminUser} (id, name, username, email, password, role, status)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`;

	const params = [
		userData.id,
		userData.name,
		userData.username,
		userData.email,
		userData.password,
		userData.role,
		userData.status
	];

	await query(sql, params);
	return true;
}

// Cek ketersediaan username atau email
export async function checkUserExists(username: string, email: string) {
	const sql = `SELECT username, email FROM ${tableAdminUser} WHERE username = ? OR email = ?`;
	const rows = (await query(sql, [username, email])) as any[];

	return {
		usernameExists: rows.some((r) => r.username.toLowerCase() === username.toLowerCase()),
		emailExists: rows.some((r) => r.email.toLowerCase() === email.toLowerCase())
	};
}

/**
 * Mencari data user admin berdasarkan username ATAU email.
 * @param identifier - String berisi username atau email pengguna
 * @returns Object UserAdminDTO jika ditemukan, atau null jika tidak ada
 */
export async function findUserByUsernameOrEmail(identifier: string): Promise<UserAdminDTO | null> {
	const sql = `
		SELECT 
			id,
			name,
			username,
			email,
			password,
			role,
			status,
			created_at AS createdAt
		FROM ${tableAdminUser}
		WHERE username = ? OR email = ?
		LIMIT 1
	`;

	try {
		// Menjalankan query dengan parameter binding
		// Catatan: Jika Anda menggunakan PostgreSQL, ganti '?' dengan '$1' dan '$2'
		const rows = (await query(sql, [identifier, identifier])) as any[];

		// Jika data tidak ditemukan
		if (!rows || rows.length === 0) {
			return null;
		}

		const row = rows[0];

		return {
			id: row.id,
			name: row.name,
			username: row.username,
			email: row.email,
			password: row.password,
			role: row.role,
			status: row.status,
			createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : String(row.created_at)
		};
	} catch (error) {
		console.error('Error pada repository findUserByUsernameOrEmail:', error);
		throw error;
	}
}

// Ambil data profil user berdasarkan ID
export async function getUserById(id: string): Promise<UserAdminDTO | null> {
	const sql = `
		SELECT 
			id, 
			name, 
			username, 
			email, 
      avatar,
			role, 
			status, 
			created_at AS createdAt 
		FROM ${tableAdminUser} 
		WHERE id = ? 
		LIMIT 1
	`;
	const rows = (await query(sql, [id])) as any[];

	if (!rows || rows.length === 0) {
		return null;
	}

	return rows[0] as UserAdminDTO;
}

/**
 * UPDATE USER (Update)
 * Memperbarui data user secara dinamis berdasarkan kolom yang dikirim
 */
export async function updateUser(id: string, data: UpdateUserData): Promise<boolean> {
	const fields = Object.keys(data);
	if (fields.length === 0) return false;

	// Memetakan key camelCase (TypeScript) ke snake_case (MySQL) jika diperlukan
	const columnMapping: Record<string, string> = {
		name: 'name',
		username: 'username',
		role: 'role',
		status: 'status'
	};

	// Menyusun query SET secara dinamis
	const setClause = fields.map((key) => `${columnMapping[key] || key} = ?`).join(', ');

	const sql = `UPDATE ${tableAdminUser} SET ${setClause} WHERE id = ?`;

	// Menyusun parameter: nilai-nilai baru diikuti oleh ID user di akhir
	const params = [...Object.values(data), id];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * 3. HAPUS USER (Delete)
 * Menghapus user berdasarkan ID
 */
export async function deleteUser(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableAdminUser} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}

/**
 * 4. AMBIL SEMUA USER DENGAN PAGINASI DAN PENCARIAN (Read - Advanced)
 * Sangat berguna untuk halaman dashboard admin (tabel user)
 */
export async function getUsersAdmin(
	search = '',
	limit = 10,
	offset = 0
): Promise<{ items: UserAdminDTO[]; total: number }> {
	let whereClause = '';
	const params: any[] = [];

	if (search) {
		whereClause = 'WHERE name LIKE ? OR username LIKE ?';
		params.push(`%${search}%`, `%${search}%`);
	}

	// Query untuk mengambil data halaman saat ini
	const itemsSql = `
		SELECT id, name, username, role, status, created_at as createdAt 
		FROM ${tableAdminUser}
		${whereClause} 
		ORDER BY created_at DESC 
		LIMIT ? OFFSET ?
	`;

	// Query untuk menghitung total baris (untuk keperluan pagination UI)
	const countSql = `SELECT COUNT(*) as total FROM ${tableAdminUser} ${whereClause}`;

	const [items, countResult] = (await Promise.all([
		query(itemsSql, [...params, limit, offset]),
		query(countSql, params)
	])) as [UserAdminDTO[], any[]];

	return {
		items,
		total: countResult[0]?.total || 0
	};
}

/**
 * 5. CEK USERNAME YANG SUDAH TERPAKAI (Validation Helper)
 * Digunakan saat register atau update agar tidak terjadi duplikasi username
 */
export async function isUsernameTaken(username: string, excludeId?: string): Promise<boolean> {
	let sql = `SELECT COUNT(*) as count FROM ${tableAdminUser} WHERE username = ?`;
	const params = [username];

	if (excludeId) {
		sql += ' AND id != ?';
		params.push(excludeId);
	}

	const rows = (await query(sql, params)) as any[];
	return rows[0].count > 0;
}
