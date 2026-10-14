import type { PageServerLoad, Actions } from './$types';
import type { DashboardActionLink } from '$lib/types/dashboard';
import {
	deleteFromJsonFile,
	ensureJsonFileExists,
	readJsonFile,
	writeJsonFile
} from '$lib/repository/json/data';
import { dashboardActionJson, navbarJson } from '$lib/constants';
import type { NavMenuItemType } from '$lib/types/navbar';
import { navMenuItems } from '$lib/data/navbar';
import { actionDashboardLinks } from '$lib/data/dashboard';
import { fail } from '@sveltejs/kit';
import { warningResponse } from '$lib/helper/message';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		// public cache
		// cache 1 menit , state-while : jika data belum ada akan di ambil belakangan
		'cache-control': 'public, max-age=60, stale-while-revalidate=30'
	});

	await ensureJsonFileExists<NavMenuItemType>(navbarJson, navMenuItems);
	await ensureJsonFileExists<DashboardActionLink>(dashboardActionJson, actionDashboardLinks);

	const navMenus = readJsonFile<NavMenuItemType[]>(navbarJson);
	const actionLinks = readJsonFile<DashboardActionLink[]>(dashboardActionJson);

	return {
		navMenus,
		actionLinks
	};
};

export const actions: Actions = {
	// ... action saveNavbar yang sudah ada sebelumnya ...

	deleteNavbarItem: async ({ request }) => {
		const formData = await request.formData();
		const idToDelete = formData.get('id')?.toString();

		if (!idToDelete) {
			return fail(400, {
				message: {
					status: 'error',
					title: 'Gagal',
					message: 'ID menu yang akan dihapus tidak valid.'
				}
			});
		}

		// Daftar ID yang dilindungi (tidak boleh dihapus jika ada di defaultNavMenus)
		const protectedIds = navMenuItems.map((item) => item.id);

		if (protectedIds.includes(idToDelete)) {
			return fail(400, {
				...warningResponse('Di Tolak', 'Menu Sistem uataam tidak dapat di hapus ')
			});
		}

		try {
			await deleteFromJsonFile<NavMenuItemType[]>(
				navbarJson,
				(existingMenus) => {
					if (!existingMenus) return [];
					return existingMenus.filter((item) => item.id !== idToDelete);
				},
				[]
			);

			return {
				success: true,
				message: {
					status: 'success',
					title: 'Berhasil',
					message: 'Item menu berhasil dihapus.'
				}
			};
		} catch (error) {
			console.error('[deleteNavbarItem Action Error]:', error);
			return fail(500, {
				message: {
					status: 'error',
					title: 'Kesalahan Sistem',
					message: 'Gagal menghapus item menu dari file JSON.'
				}
			});
		}
	},
	deleteActionLink: async ({ request }) => {
		const formData = await request.formData();
		const idToDelete = formData.get('id')?.toString();

		if (!idToDelete) {
			return fail(400, {
				message: {
					status: 'error',
					title: 'Gagal',
					message: 'ID Action Link yang akan dihapus tidak valid.'
				}
			});
		}

		try {
			await deleteFromJsonFile<DashboardActionLink[]>(
				dashboardActionJson,
				(existingLinks) => {
					if (!existingLinks) return [];
					// Filter keluar item yang ID-nya cocok dengan yang ingin dihapus
					return existingLinks.filter((item) => item.id !== idToDelete);
				},
				[]
			);

			return {
				success: true,
				message: {
					status: 'success',
					title: 'Berhasil',
					message: 'Action Link berhasil dihapus.'
				}
			};
		} catch (error) {
			console.error('[deleteActionLink Action Error]:', error);
			return fail(500, {
				message: {
					status: 'error',
					title: 'Kesalahan Sistem',
					message: 'Gagal menghapus Action Link dari file JSON.'
				}
			});
		}
	}
};
