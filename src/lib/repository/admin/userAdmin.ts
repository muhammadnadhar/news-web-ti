import { query } from '$lib/database/svelteDb';
import type { UserAdminDTO } from '$lib/dto/admin/userAdmin';
import { tableAdminUser } from '$lib/seeder/admin/userAdmin';

// Tipe data parsial untuk operasi update (agar kolom yang diupdate bersifat opsional)
export type UpdateUserData = Partial<Omit<UserAdminDTO, 'id' | 'createdAt'>>;

/**
 * TAMBAH USER ADMIN BARU
 */
export async function createUserAdmin(userData: Omit<UserAdminDTO, 'createdAt'>): Promise<boolean> {
	const sql = `
        INSERT INTO ${tableAdminUser} (id, name, username, email, password, role, status, image_url, image_public_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

	const params = [
		userData.id,
		userData.name,
		userData.username,
		userData.email,
		userData.password,
		userData.role,
		userData.status,
		userData.image_url ?? null,
		userData.image_public_id ?? null
	];

	await query(sql, params);
	return true;
}

/**
 * CEK KETERSEDIAAN USERNAME / EMAIL
 */
export async function checkUserExists(username: string, email: string) {
	const sql = `SELECT username, email FROM ${tableAdminUser} WHERE username = ? OR email = ?`;
	const rows = (await query(sql, [username, email])) as any[];

	return {
		usernameExists: rows.some((r) => r.username.toLowerCase() === username.toLowerCase()),
		emailExists: rows.some((r) => r.email.toLowerCase() === email.toLowerCase())
	};
}

/**
 * CARI USER BERDASARKAN USERNAME / EMAIL (Untuk Auth/Login)
 */
export async function findUserByUsernameOrEmail(identifier: string): Promise<UserAdminDTO | null> {
	const sql = `
        SELECT 
            id,
            name,
            username,
            email,
            image_url,
            image_public_id,
            password,
            role,
            status,
            created_at AS createdAt
        FROM ${tableAdminUser}
        WHERE username = ? OR email = ?
        LIMIT 1
    `;

	try {
		const rows = (await query(sql, [identifier, identifier])) as any[];

		if (!rows || rows.length === 0) {
			return null;
		}

		const row = rows[0];

		return {
			id: row.id,
			name: row.name,
			username: row.username,
			email: row.email,
			image_url: row.image_url ?? null,
			image_public_id: row.image_public_id ?? null,
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

/**
 * AMBIL USER BERDASARKAN ID
 */
export async function getUserById(id: string): Promise<UserAdminDTO | null> {
	const sql = `
        SELECT 
            id, 
            name, 
            username, 
            email, 
            image_url,
            image_public_id,
            password,
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

	const row = rows[0];
	return {
		id: row.id,
		name: row.name,
		username: row.username,
		email: row.email,
		image_url: row.image_url ?? null,
		image_public_id: row.image_public_id ?? null,
		password: row.password,
		role: row.role,
		status: row.status,
		createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : String(row.created_at)
	};
}

/**
 *  UPDATE USER (Dinamis)
 */
export async function updateUser(id: string, data: UpdateUserData): Promise<boolean> {
	const fields = Object.keys(data);
	if (fields.length === 0) return false;

	// Memetakan key TypeScript ke nama kolom MySQL
	const columnMapping: Record<string, string> = {
		name: 'name',
		username: 'username',
		email: 'email',
		role: 'role',
		status: 'status',
		image_url: 'image_url',
		image_public_id: 'image_public_id',
		password: 'password'
	};

	// Menyusun query SET secara dinamis
	const setClause = fields.map((key) => `${columnMapping[key] || key} = ?`).join(', ');

	const sql = `UPDATE ${tableAdminUser} SET ${setClause} WHERE id = ?`;

	// Menyusun parameter
	const params = [...Object.values(data), id];

	const result = (await query(sql, params)) as any;
	return result.affectedRows > 0;
}

/**
 * 6. HAPUS USER
 */
export async function deleteUser(id: string): Promise<boolean> {
	const sql = `DELETE FROM ${tableAdminUser} WHERE id = ?`;
	const result = (await query(sql, [id])) as any;
	return result.affectedRows > 0;
}

/**
 * 7. AMBIL SEMUA USER DENGAN PAGINASI DAN PENCARIAN
 */
export async function getUsersAdmin(
	search = '',
	limit = 10,
	offset = 0
): Promise<{ items: UserAdminDTO[]; total: number }> {
	let whereClause = '';
	const params: any[] = [];

	if (search) {
		whereClause = 'WHERE name LIKE ? OR username LIKE ? OR email LIKE ?';
		params.push(`%${search}%`, `%${search}%`, `%${search}%`);
	}

	// Query untuk mengambil data halaman saat ini
	const itemsSql = `
        SELECT id, name, username, email, image_url, image_public_id, role, status, created_at as createdAt 
        FROM ${tableAdminUser}
        ${whereClause} 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
    `;

	// Query untuk menghitung total baris
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
 * CEK USERNAME TAKEN
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
