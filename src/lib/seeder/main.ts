// semua seeder akan di jalkan di foler ini yang menjadi entry point data utama
import { dbName, initializeDatabase, pool } from '$lib/server/db';
import {
	AcademicCalendarTableSeed,
	PedomanKkpTableSeed,
	PedomanTaTableSeed,
	PracticumModuleTableSeed,
	RecruitmentTableSeed
} from './admin/article/akademik';
import { NewsTableSeed } from './admin/article/berita';
import {
	AccreditationTableSeed,
	HistoryContentTableSeed,
	HistoryLeadersTableSeed,
	LecturerStaffTableSeed,
	OrganizationalStructureTableSeed,
	VisiMisiTableSeed
} from './admin/article/profile';
import { AngkatanTableSeed, SemesterTableSeed } from './admin/dataset';
import { UserTableSeed } from './admin/userAdmin';

try {
	//
	// Database ssetup
	//
	await initializeDatabase(dbName);
	//
	// TABLE >>>>>>>>>>>
	//
	// --------------- Section Admin --------------
	UserTableSeed();
	// DATASET

	// ARTICLE
	// akademik
	PedomanTaTableSeed();
	PedomanKkpTableSeed();
	RecruitmentTableSeed();
	PracticumModuleTableSeed();
	AcademicCalendarTableSeed();
	// profile
	HistoryContentTableSeed();
	HistoryLeadersTableSeed();
	VisiMisiTableSeed();
	OrganizationalStructureTableSeed();
	LecturerStaffTableSeed();
	AccreditationTableSeed();

	// berita
	NewsTableSeed();

	// dataset
	AngkatanTableSeed();
	SemesterTableSeed();

	//
	// TABLE >>>>>>>>>>>
	//
} catch (error) {
	console.error(' Seeding gagal karena terjadi error:', error);
} finally {
	await pool.end();
	console.log(' Koneksi database telah ditutup dengan aman.');
}
