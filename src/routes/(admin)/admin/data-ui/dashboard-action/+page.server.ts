import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { errorResponse, successResponse } from '$lib/helper/message';
import type { DashboardActionLink } from '$lib/types/dashboard';
import type { DataUIFormValues } from '$lib/types/values/dataui';
import { writeJsonFile } from '$lib/repository/json/data';
import { dashboardActionJson } from '$lib/constants';

export const actions: Actions = {
	// Action untuk memperbarui data Action Links
	updateActionLinks: async ({ request, locals }) => {
		// if (!locals.user || locals.user.role !== 'administrator') {
		//     return fail(403, { message: { type: 'error', text: 'Unauthorized: Akses khusus Administrator' } });
		// }

		const formData = await request.formData();
		const dataString = formData.get('actionLinksData')?.toString() || '';

		let actionLinks: DashboardActionLink[] = [];
		try {
			actionLinks = JSON.parse(dataString);
		} catch {
			return fail(400, {
				...errorResponse('Format data Action Links tidak valid (JSON parse error).', 'Error'),
				values: { actionLinks: null } as DataUIFormValues
			});
		}

		try {
			await writeJsonFile<DashboardActionLink[]>(
				dashboardActionJson,
				(existingLinks) => {
					const currentLinks = existingLinks || [];

					const incomingMap = new Map(actionLinks.map((item) => [item.id, item]));

					const updatedLinks = currentLinks.map((existingItem) => {
						if (incomingMap.has(existingItem.id)) {
							const newItem = incomingMap.get(existingItem.id)!;
							incomingMap.delete(existingItem.id); // Hapus dari map setelah di-update
							return { ...existingItem, ...newItem };
						}
						return existingItem;
					});

					// 2. Tambahkan item baru jika ada ID yang belum ada di data lama
					const brandNewItems = Array.from(incomingMap.values());

					return [...updatedLinks, ...brandNewItems];
				},
				[] // Fallback array kosong jika file JSON belum ada
			);
		} catch (err: any) {
			console.error('Error updating Action Links:', err);
			return fail(500, {
				message: {
					type: 'error',
					text: err.message || 'Gagal menyimpan perubahan action links ke file JSON.'
				},
				values: { actionLinks } as DataUIFormValues
			});
		}

		return {
			...successResponse('Dashboard action link berhasil di perbaharui'),
			values: { actionLinks } as DataUIFormValues
		};
	}
};
