import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	deleteOrgStructure,
	getAllOrgStructures,
	createOrgStructure,
	updateOrgStructure
} from '$lib/repository/admin/article/profile/structure';
export const load: PageServerLoad = async () => {
	try {
		// const orgStructures = await getAllOrgStructures();
		return {
			orgStructures: getAllOrgStructures()
		};
	} catch (err) {
		console.error('Error loading organizational structure data:', err);
		throw error(500, 'Gagal mengambil data Struktur Organisasi dari server.');
	}
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const id = (formData.get('id') as string) || crypto.randomUUID();
		const isEdit = formData.get('is_edit') === 'true';
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const imageFile = formData.get('image') as File | null;

		if (!title) {
			return fail(400, { missingTitle: true, message: 'Judul Struktur Organisasi wajib diisi.' });
		}

		let imageUrl = (formData.get('existing_image_url') as string) || null;

		if (imageFile && imageFile.size > 0) {
			// Simpan atau upload file baru di sini...
		}

		try {
			if (isEdit) {
				await updateOrgStructure(id, { title, image_url: imageUrl, description });
			} else {
				await createOrgStructure(id, { title, image_url: imageUrl, description });
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving organizational structure:', err);
			return fail(500, { message: 'Gagal menyimpan data.' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { message: 'ID tidak valid.' });

		try {
			await deleteOrgStructure(id);
			return { success: true };
		} catch (err) {
			console.error('Error deleting organizational structure:', err);
			return fail(500, { message: 'Gagal menghapus data.' });
		}
	}
};
