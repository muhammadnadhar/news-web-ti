import type { ImageItem } from '$lib/dto/admin/home';

export interface DosenPrimaryFormValue {
	id?: string;
	lecturerStaffId: string;
	position: string;
}
export interface PeminatanFormValues {
	id?: string;
	title: string;
	description: string;
}

export interface ProfileDashboardFormValues {
	id?: string;
	title: string;
	imagePath: string;
	image_public_id?: string;
}

export interface ProfilProdiFormValues {
	id?: string;
	title: string;
	description: string;
	displayInstruction: string;
	images: ImageItem[];
}
