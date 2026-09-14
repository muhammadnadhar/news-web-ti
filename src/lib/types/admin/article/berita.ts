// Interface DTO
export interface NewsItemDTO {
	id: string;
	title: string;
	category: string;
	content: string;
	image_url?: string | null;
	published_at: Date | string;
	created_at?: Date | string;
	updated_at?: Date | string;
}
