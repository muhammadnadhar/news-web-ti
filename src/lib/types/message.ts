export type MessageStatus = 'success' | 'error' | 'warning' | 'info';

export interface ResponseMessage {
	status: MessageStatus;
	title: string;
	message: string;
	errors?: Record<string, string[]>; // Opsional: untuk validasi form per-field
}
