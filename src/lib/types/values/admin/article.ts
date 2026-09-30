export interface NewsFormValues {
	title: string;
	category: string;
	content: string;
	imageUrl: string | null;
	imageId: string | null; // atau image_public_id sesuai standar penamaan Anda
}

// ------- Profile ----------
export interface FasilitasFormValues {
	name: string;
	category: string;
	brandModel: string | null;
	description: string | null;
	imageUrl: string | null;
	imageId: string | null;
	sopLink: string | null;
}

// --------------- Akademic ----------
export interface PedomanKkpFormValues {
	title: string;
	imageUrl: string | null;
	imageId: string | null;
	description: string | null;
}
