export interface AngkatanFormValues {
	id?: string;
	year: string; // Tipe string agar aman mengembalikan input mentah ke form saat validasi gagal
}
export interface JabatanProdiFormValues {
	id?: string;
	name: string;
}

export interface KategoriBeritaFormValues {
	id?: string;
	name: string;
	slug?: string | null;
}

export interface SemesterFormValues {
	id?: string;
	name: string;
	academicYear: string;
	isActive: boolean;
}
