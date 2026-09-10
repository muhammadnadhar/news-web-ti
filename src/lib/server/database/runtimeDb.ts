import mysql from 'mysql2/promise';
//
// !! ini di gunakan di runtime tidak di gunakan di svelte
// !! file ini terpisah dengan projek utama
// !! jadi akan menggunaka bawaan runtime
//

// erro karena bawan sveltekit buakn tsx
// import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '$env/static/private';
//

const connectionConfig = {
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || ''
};

export async function initializeDatabase(dbName: string) {
	// Buka koneksi sementara ke server MySQL
	const connection = await mysql.createConnection(connectionConfig);

	// Eksekusi query untuk membuat database jika belum ada
	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);

	console.log(`Database "${dbName}" siap digunakan.`);
	await connection.end();
}

//Buat pool utama yang akan digunakan oleh aplikasi Anda
// Kita jalankan fungsi inisialisasi di atas sebelum pool digunakan, atau pastikan seeder memanggilnya
export const dbName = process.env.DB_DATABASE || 'newsTi';

export const pool = mysql.createPool({
  ...connectionConfig,
	port: Number(process.env.DB_PORT) || 3306,
	database: dbName,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	keepAliveInitialDelay: 10000, // Menjaga koneksi tetap hidup
	enableKeepAlive: true
});

/**
 * Helper function untuk mengeksekusi SQL query dengan parameter
 * @param {string}sql
 * @param {Array}params 
 *  any : karena bisa menerima data dengan interface 
 */
export async function query(sql: string, params: any[] = []) {
	try {
		const [results] = await pool.query(sql, params);
		return results;
	} catch (error) {
		console.error('Database Query Error:', error);
		throw error;
	}
}
