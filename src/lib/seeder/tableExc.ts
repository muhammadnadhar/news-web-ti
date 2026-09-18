// semua seeder akan di jalkan di foler ini yang menjadi entry point data utama
import { createUserAdmin } from '$lib/server/admin/repository/userAdmin';
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
import { AngkatanTableSeed, JabatanProdiTableSeed, SemesterTableSeed } from './admin/dataset';
import {
	DosenPrimaryTableSeed,
	PerminatanTITableSeed,
	ProfileDashboardTableSeed,
	ProfilProdiTableSeed
} from './admin/home';
import { UserTableSeed } from './admin/userAdmin';

try {
	//
	// Database ssetup
	//
	await initializeDatabase(dbName);
	//
	// TABLE >>>>>>>>>>>
	//
	// --------------- Section Admin (Dijalankan Berurutan) --------------
	await UserTableSeed();

	// ARTICLE - akademik
	await PedomanTaTableSeed();
	await PedomanKkpTableSeed();
	await RecruitmentTableSeed();
	await PracticumModuleTableSeed();
	await AcademicCalendarTableSeed();

	// ARTICLE - profile
	await HistoryContentTableSeed();
	await HistoryLeadersTableSeed();
	await VisiMisiTableSeed();
	await OrganizationalStructureTableSeed();
	await LecturerStaffTableSeed();
	await AccreditationTableSeed();

	// DATASET
	await AngkatanTableSeed();
	await SemesterTableSeed();

	// ARTICLE - kemahasiswaan
	await ScholarshipTableSeed();
	await StudentAchievementTableSeed();
	await HighGpaStudentTableSeed();

	// ARTICLE - berita
	await NewsTableSeed();

	// ARTICLE - kerjasama
	await PartnershipTableSeed();
	await ActivityDocumentationTableSeed();

	// ARTICLE - kurikulum
	await CourseMapTableSeed();
	await ObeCurriculumTableSeed();

	// ARTICLE - penelitian
	await LecturerPublicationTableSeed();
	await StudentPublicationTableSeed();
	await LecturerResearchTableSeed();

	// HOME
	await DosenPrimaryTableSeed(); // ini punya forengkey ke LecturerStaffTableSeed
	await JabatanProdiTableSeed(); // forengkey di table LecturerStaffTableSeed
	await PerminatanTITableSeed();
	await ProfilProdiTableSeed();
	await ProfileDashboardTableSeed();

	//
	// Default Data in database
	//
} catch (error) {
	console.error(' Seeding gagal karena terjadi error:', error);
} finally {
	await pool.end();
	console.log(' Koneksi database telah ditutup dengan aman.');
}
