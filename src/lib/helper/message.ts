import type { MessageStatus, ResponseMessage } from '$lib/types/message';

/**
 * Helper pembuat DTO Response standar
 */
export function createResponse(
	status: MessageStatus,
	message: string,
	title?: string,
	errors?: Record<string, string[]>
): ResponseMessage {
	const defaultTitles: Record<MessageStatus, string> = {
		success: 'Berhasil',
		error: 'Gagal',
		warning: 'Peringatan',
		info: 'Informasi'
	};

	return {
		status,
		title: title || defaultTitles[status],
		message,
		errors
	};
}

// Shortcut function agar lebih praktis
export const successResponse = (message: string, title?: string) =>
	createResponse('success', message, title);

export const errorResponse = (message: string, title?: string, errors?: Record<string, string[]>) =>
	createResponse('error', message, title, undefined, errors);

export const warningResponse = (message: string, title?: string) =>
	createResponse('warning', message, title);
