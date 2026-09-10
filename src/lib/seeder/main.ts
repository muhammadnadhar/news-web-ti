// semua seeder akan di jalkan di foler ini yang menjadi entry point data utama
import { dbName, initializeDatabase, pool } from '$lib/server/database/runtimeDb';
import {
	AcademicCalendarTableSeed,
	PedomanKkpTableSeed,
	PedomanTaTableSeed,
	PracticumModuleTableSeed,
	RecruitmentTableSeed
} from './admin/article/akademik';
import { NewsTableSeed } from './admin/article/berita';
import {
	HighGpaStudentTableSeed,
	ScholarshipTableSeed,
	StudentAchievementTableSeed
} from './admin/article/kemahasiswaan';
import { ActivityDocumentationTableSeed, PartnershipTableSeed } from './admin/article/kerjasama';
import { CourseMapTableSeed, ObeCurriculumTableSeed } from './admin/article/kurikulum';
import {
	LecturerPublicationTableSeed,
	LecturerResearchTableSeed,
	StudentPublicationTableSeed
} from './admin/article/penelitian';
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
	await Promise.all([
		// --------------- Section Admin --------------
		UserTableSeed(),

		// ARTICLE - akademik
		PedomanTaTableSeed(),
		PedomanKkpTableSeed(),
		RecruitmentTableSeed(),
		PracticumModuleTableSeed(),
		AcademicCalendarTableSeed(),

		// ARTICLE - profile
		HistoryContentTableSeed(),
		HistoryLeadersTableSeed(),
		VisiMisiTableSeed(),
		OrganizationalStructureTableSeed(),
		LecturerStaffTableSeed(),
		AccreditationTableSeed(),

		// ARTICLE - kemahasiswaan
		ScholarshipTableSeed(),
		StudentAchievementTableSeed(),
		HighGpaStudentTableSeed(),

		// ARTICLE - berita
		NewsTableSeed(),

		// ARTICLE - kerjasama
		PartnershipTableSeed(),
		ActivityDocumentationTableSeed(),

		// ARTICLE - kurikulum
		CourseMapTableSeed(),
		ObeCurriculumTableSeed(),

		// ARTICLE - penelitian
		LecturerPublicationTableSeed(),
		StudentPublicationTableSeed(),
		LecturerResearchTableSeed(),

		// DATASET
		AngkatanTableSeed(),
		SemesterTableSeed()
	]);
	// TABLE >>>>>>>>>>>	//
	// TABLE >>>>>>>>>>>
	//
} catch (error) {
	console.error(' Seeding gagal karena terjadi error:', error);
} finally {
	await pool.end();
	console.log(' Koneksi database telah ditutup dengan aman.');
}
