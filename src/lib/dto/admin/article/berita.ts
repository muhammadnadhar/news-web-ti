// Interface DTO
// Interface DTO Berita (Diperbarui)
export interface NewsItemDTO {
	id: string;
	title: string;
	category_id: string; // Ref ke ID tabel kategori
	category_name?: string; // Ditambahkan jika query menggunakan JOIN ke tabel kategori
	content: string;
	image_url?: string | null;
	published_at: Date | string;
	created_at?: Date | string;
	updated_at?: Date | string;
}
