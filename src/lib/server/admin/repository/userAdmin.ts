import { tableAdminUser } from '$lib/seeder/admin/userAdmin';
import { query } from '$lib/server/database/svelteDb';

export interface UserAdminItem {
	id: string;
	name: string;
	username: string;
	role: 'Administrator' | 'Dosen' | 'Operator' | 'Mahasiswa';
	status: 'Active' | 'Inactive';
	createdAt: string;
}

// Tipe data parsial untuk operasi update (agar kolom yang diupdate bersifat opsional)
export type UpdateUserData = Partial<Omit<UserAdminItem, 'id' | 'createdAt'>>;

/**
 * TAMBAH USER (Create)
 * Menambahkan satu user baru ke database
 */
export async function createUser(user: UserAdminItem): Promise<any> {
	const sql = `
		INSERT INTO ${tableAdminUser} (id, name, username, role, status, created_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`;

	const params = [user.id, user.name, user.username, user.role, user.status, user.createdAt];
	return await query(sql, params);
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
): Promise<{ items: UserAdminItem[]; total: number }> {
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
	])) as [UserAdminItem[], any[]];

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
