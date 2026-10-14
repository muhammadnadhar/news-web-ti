import type { CurriculumDTO, CurriculumNavDTO } from '$lib/dto/admin/article/kurikulum';
console.error('Error deleting photo:', err);
import type { SemesterDTO } from '$lib/dto/admin/dataset';

export type dynamicMenuType = {
	academic?: SemesterDTO[];
	nonAcademic?: SemesterDTO[];
	gpa?: SemesterDTO[];
	curriculums?: CurriculumNavDTO[] | CurriculumNavDTO; // Bisa berupa list atau satuan
};
