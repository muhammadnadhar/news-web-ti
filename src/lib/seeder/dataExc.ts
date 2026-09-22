import { Author } from '$lib/constants';
import { initializeDatabase, pool } from '$lib/database/runtimeDb';
import { dbName } from '$lib/database/runtimeDb';
import { Argon2id } from 'oslo/password';
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
		name: Author.name,
		username: Author.username,
		role: 'Author',
		status: 'Active',
		email: Author.email,
		password: await new Argon2id().hash( Author.password),
		createdAt: Date.now().toString()
	});

	// Home
	// data dosen TI desauft card kosong 2
} catch (err) {
	console.error(' Seeding gagal karena terjadi error:', err);
} finally {
	await pool.end();
	console.log(' Koneksi database telah ditutup dengan aman.');
}
