import mysql from 'mysql2/promise';
import { 
	DB_HOST, 
	DB_USER, 
	DB_PASSWORD, 
	DB_DATABASE, 
	DB_PORT 
} from '$env/static/private';


//
// !1 ini koneksi yang di gunakan oleh svelte
//


// Konfigurasi koneksi menggunakan env bawaan SvelteKit
const connectionConfig = {
	host: DB_HOST || 'localhost',
	user: DB_USER || 'root',
	password: DB_PASSWORD || ''
};

export async function initializeDatabase(dbName: string) {
	// Buka koneksi sementara ke server MySQL
	const connection = await mysql.createConnection(connectionConfig);

	// Eksekusi query untuk membuat database jika belum ada
	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);

	console.log(`Database "${dbName}" siap digunakan.`);
	await connection.end();
}

// Nama database dari env
export const dbName = DB_DATABASE || 'newsTi';

// Pool utama aplikasi
export const pool = mysql.createPool({
	...connectionConfig,
	port: Number(DB_PORT) || 3306,
	database: dbName,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	keepAliveInitialDelay: 10000,
	enableKeepAlive: true
});

// Helper function query untuk mempermudah eksekusi SQL
export async function query(sql: string, params: any[] = []) {
	try {
		const [results] = await pool.execute(sql, params);
		return results;
	} catch (error) {
		console.error('Database Query Error:', error);
		throw error;
	}
}
