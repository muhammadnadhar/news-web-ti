/**
 * Konversi Date / Timestamp Epoch (Milidetik) ke format string MySQL 'YYYY-MM-DD HH:mm:ss'
 */
export function toMySQLDateTime(input?: Date | string | number): string {
	if (!input) return new Date().toISOString().slice(0, 19).replace('T', ' ');

	let date: Date;

	const num = Number(input);
	if (!isNaN(num)) {
		date = new Date(num);
	} else {
		date = new Date(input);
	}

	// Fallback jika nilai Date tidak valid
	if (isNaN(date.getTime())) {
		date = new Date();
	}

	return date.toISOString().slice(0, 19).replace('T', ' ');
}
