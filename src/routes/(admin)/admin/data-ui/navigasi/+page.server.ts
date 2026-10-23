import { navbarJson } from '$lib/constants';
import { errorResponse, successResponse, warningResponse } from '$lib/helper/message';
import { writeJsonFile } from '$lib/repository/json/data';
import type { NavMenuItemType } from '$lib/types/navbar';
import type { DataUIFormValues } from '$lib/types/values/dataui';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	// Action untuk memperbarui data Navbar
	updateNavbar: async ({ request, locals }) => {
		// if (!locals.user || locals.user.role !== 'administrator') {
		//     return fail(403, { message: { type: 'error', text: 'Unauthorized' } });
		// }

		const formData = await request.formData();
		const dataString = formData.get('navbarData')?.toString() || '';

		let navMenus: NavMenuItemType[] = [];
		try {
			navMenus = JSON.parse(dataString);
		} catch {
			return fail(400, {
        ...errorResponse("Fotmat data Navbar tidak valid","error"),
				values: { navMenus: null } as DataUIFormValues
			});
		}

		try {
			await writeJsonFile<NavMenuItemType[]>(
				navbarJson,
				(existingMenus) => {
					const currentMenus = existingMenus || [];

					// Buat Map dari menu baru yang dikirim dari form berdasarkan ID untuk pencarian cepat
					const incomingMap = new Map(navMenus.map((item) => [item.id, item]));

					const updatedMenus = currentMenus.map((existingItem) => {
						if (incomingMap.has(existingItem.id)) {
							const newItem = incomingMap.get(existingItem.id)!;
							incomingMap.delete(existingItem.id); // Hapus dari map setelah di-update
							return { ...existingItem, ...newItem };
						}
						return existingItem;
					});

					const brandNewItems = Array.from(incomingMap.values());

					return [...updatedMenus, ...brandNewItems];
				},
				[] // Fallback jika file JSON belum pernah ada
			);
		} catch (err: any) {
			console.error('Error updating Navbar:', err);
			return fail(500, {
				...warningResponse('Error menyimpan data di navbar', 'Warning'),
				values: { navMenus } as DataUIFormValues
			});
		}

		return {
			...successResponse('Navbar menu berhasil di perbaharui', 'Success'),
			values: { navMenus } as DataUIFormValues
		};
	}
};
