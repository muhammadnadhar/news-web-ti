import { error } from '@sveltejs/kit';
import { 
    getNewsCategoryBySlug, 
    getNewsByCategorySlugSlice, 
    getTotalNewsCountByCategorySlug 
} from '$lib/repository/admin/article/berita';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, url }) => {
    const { slug } = params;

    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(url.searchParams.get('limit')) || 5);

    const from = (page - 1) * limit;
    const to = from + limit;

    return {
        // Stream data kategori
        category: getNewsCategoryBySlug(slug).then((cat) => {
            if (!cat) throw error(404, 'Kategori tidak ditemukan');
            return cat;
        }),
        // Stream data daftar berita dalam kategori ini
        newsList: getNewsByCategorySlugSlice(slug, from, to),
        // Stream pagination info
        pagination: getTotalNewsCountByCategorySlug(slug).then((totalNews) => {
            const totalPages = Math.ceil(totalNews / limit);
            return {
                currentPage: page,
                limit,
                totalNews,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            };
        })
    };
};
