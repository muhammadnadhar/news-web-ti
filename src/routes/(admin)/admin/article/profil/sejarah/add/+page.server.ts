import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAllLecturerStaff } from '$lib/repository/admin/article/profile/dosen&staff';
import { addHistoryLeader } from '$lib/repository/admin/article/profile/sejarah';

export const load: PageServerLoad = async () => {
    // Ambil daftar seluruh dosen dan staf dari database
    const lecturers = await getAllLecturerStaff();

    return {
        lecturers
    };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const period = formData.get('period')?.toString().trim();
        const head_id = formData.get('head_id')?.toString().trim() || null;
        const secretary_id = formData.get('secretary_id')?.toString().trim() || null;

        if (!period) {
            return fail(400, {
                message: 'Periode jabatan wajib diisi.'
            });
        }

        try {
            await addHistoryLeader({
                period,
                head_id,
                secretary_id
            });
        } catch (error: any) {
            return fail(500, {
                message: 'Gagal menyimpan data pimpinan: ' + error.message
            });
        }

        // Redirect kembali ke halaman utama sejarah pimpinan setelah berhasil
        throw redirect(303, '/admin/profile/history');
    }
};
