import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { errorResponse, successResponse } from '$lib/helper/message';
import { randomUUID } from '$lib/crypto';
import { addCalendarImages, createAcademicCalendar } from '$lib/repository/admin/article/akedemik/kalender';

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        
        const title = (formData.get('title') as string)?.trim();
        const description = (formData.get('description') as string)?.trim();
        
    const rawUrls = formData.getAll('image_url') as string[];
        const newImageUrls = rawUrls.map(url => url.trim()).filter(url => url.length > 0);

        // Validasi
        if (!title) {
            return fail(400, errorResponse('Judul Kalender wajib diisi.', 'Validasi Gagal'));
        }

        try {
            const newCalendarId = randomUUID();

            //Simpan Data Utama Kalender
            await createAcademicCalendar(newCalendarId, title, description);

            // Simpan Data Gambar (jika ada)
           if (newImageUrls.length > 0) {
                const newImageRecords = newImageUrls.map((url) => ({
                    id: randomUUID(),
                    calendarId: newCalendarId,
                    imageUrl: url
                }));
                await addCalendarImages(newImageRecords);
            }

            return successResponse('Data Kalender Akademik berhasil ditambahkan!');
        } catch (err: any) {
            console.error('Error creating Academic Calendar:', err);
            return fail(500, errorResponse(`Terjadi kesalahan sistem: ${err.message}`));
        }
    }
};
