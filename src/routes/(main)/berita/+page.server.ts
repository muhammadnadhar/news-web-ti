import type { PageServerLoad } from './$types';
import { getAllNews } from '$lib/server/admin/repository/article/berita';

export const load: PageServerLoad = async () => {
    const newsList = await getAllNews();

    // Mengambil 5 berita terbaru untuk Widget Sidebar
    const recentNews = newsList.slice(0, 5);

    //  Kalkulasi jumlah berita per kategori secara dinamis
    const categoryCounts: Record<string, number> = {};
    newsList.forEach((item) => {
        const cat = item.category || 'Tak Berkategori';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count
    }));

    return {
        newsList,
        recentNews,
        categories
    };
};
