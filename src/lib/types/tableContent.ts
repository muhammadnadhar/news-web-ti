export interface tableItem {
	colomn: string;
	row: string | number;
  // action untuk menetukan type dari row
	isImage?: boolean; //  paksa sebagai gambar jika URL tidak mengandung ekstensi file
	isLink?: boolean;  // paksa sebagai tautan URL
}

export interface TableContentType {
	id: string | number;
	items: tableItem[];
}
