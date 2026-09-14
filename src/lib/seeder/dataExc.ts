import { dbName, initializeDatabase, pool } from '$lib/server/database/runtimeDb';
import { defaultUserData } from './admin/userAdmin';

try {
	//
	// Database ssetup
	//
	await initializeDatabase(dbName);
	//

	// Users
	// user default loh yah
	await defaultUserData({
		id: 'only-one',
		name: 'dar',
		username: 'muhammad nadhar',
		role: 'Author',
		status: 'Active',
		email: 'author2gmail.com',
		password: 'dar07',
		createdAt: Date.now().toString()
	});
} catch (err) {
	console.error(' Seeding gagal karena terjadi error:', err);
} finally {
	await pool.end();
	console.log(' Koneksi database telah ditutup dengan aman.');
}
