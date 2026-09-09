<script lang="ts">
    import type { PageData } from './$types';
    import { User, Calendar, ArrowRight, Folder, Tag } from 'lucide-svelte';

    let data: PageData = $props();

    // Tracker status loading gambar untuk skeleton effect
    let loadedImages: Record<string, boolean> = {};

    function handleImageLoad(id: string) {
        loadedImages[id] = true;
    }
</script>

<div class="bg-[var(--color-bg-primary)] min-h-screen text-[var(--color-text-main)] py-10 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Grid Layout Utama: Konten Berita (Kiri) & Sidebar Sticky (Kanan) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <!-- ================= UTAMA: LIST BERITA (8 COLS) ================= -->
            <main class="lg:col-span-8 space-y-8">
                {#each data.newsList as news (news.id)}
                    <article class="bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        
                        <!-- Wrapper Image dengan Skeleton Loading Component -->
                        <div class="relative w-full h-80 sm:h-96 bg-[var(--color-bg-primary-glare)] overflow-hidden">
                            <!-- Skeleton Component Shimmer saat gambar belum selesai load -->
                            {#if !loadedImages[news.id]}
                                <div class="absolute inset-0 animate-pulse bg-gradient-to-r from-[var(--color-bg-primary-glare)] via-[var(--color-bg-secondary-hover)] to-[var(--color-bg-primary-glare)]"></div>
                            {/if}

                            <img
                                src={news.image_url || '/placeholder-news.jpg'}
                                alt={news.title}
                                on:load={() => handleImageLoad(news.id)}
                                class="w-full h-full object-cover transition-opacity duration-300 {loadedImages[news.id] ? 'opacity-100' : 'opacity-0'}"
                            />
                        </div>

                        <!-- Content Card Berita -->
                        <div class="p-6 sm:p-8 space-y-4">
                            <!-- Meta Info (Penulis & Tanggal) -->
                            <div class="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)] font-medium">
                                <div class="flex items-center gap-1.5">
                                    <User class="w-4 h-4 text-[var(--color-accent-primary)]" />
                                    <span>M. Fadhlan</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <Calendar class="w-4 h-4 text-[var(--color-accent-primary)]" />
                                    <span>
                                        {new Date(news.published_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>

                            <!-- Judul Berita -->
                            <h2 class="text-xl sm:text-2xl font-bold text-[var(--color-text-main)] hover:text-[var(--color-accent-purple)] transition-colors line-clamp-2">
                                <a href={`/news/${news.id}`}>
                                    {news.title}
                                </a>
                            </h2>

                            <!-- Ringkasan Teks Berita -->
                            <p class="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
                                {news.content || 'Prodi Teknologi Informasi Fakultas Sains dan Teknologi kembali menyelenggarakan kegiatan akademik dan kemahasiswaan...'}
                            </p>

                            <!-- Tombol Read More -->
                            <div class="pt-2 flex justify-end">
                                <a
                                    href={`/news/${news.id}`}
                                    class="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[var(--color-bg-secondary-hover)] hover:bg-[var(--color-accent-purple)] text-[var(--color-text-main)] hover:text-white transition-all shadow-sm"
                                >
                                    <span>Read More</span>
                                    <ArrowRight class="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>

                    </article>
                {/each}
            </main>

            <!-- ================= SIDEBAR (4 COLS - STICKY) ================= -->
            <aside class="lg:col-span-4 lg:sticky lg:top-8 space-y-8">
                
                <!-- WIDGET 1: BERITA TERBARU -->
                <div class="bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] rounded-xl p-6 shadow-sm">
                    <h3 class="text-lg font-bold text-[var(--color-accent-primary)] mb-5 pb-2 border-b border-[var(--color-border-light)] flex items-center gap-2">
                        <span>Berita Terbaru</span>
                    </h3>

                    <div class="space-y-4">
                        {#each data.recentNews as recent (recent.id)}
                            <a href={`/news/${recent.id}`} class="flex gap-3 group items-start">
                                <!-- Thumbnail dengan Skeleton Effect -->
                                <div class="relative w-16 h-16 rounded-lg bg-[var(--color-bg-primary-glare)] overflow-hidden shrink-0 border border-[var(--color-border-light)]">
                                    {#if !loadedImages[`thumb-${recent.id}`]}
                                        <div class="absolute inset-0 animate-pulse bg-[var(--color-bg-secondary-hover)]"></div>
                                    {/if}
                                    <img
                                        src={recent.image_url || '/placeholder-thumb.jpg'}
                                        alt={recent.title}
                                        on:load={() => handleImageLoad(`thumb-${recent.id}`)}
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 {loadedImages[`thumb-${recent.id}`] ? 'opacity-100' : 'opacity-0'}"
                                    />
                                </div>

                                <!-- Text Item -->
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-xs font-semibold text-[var(--color-text-main)] group-hover:text-[var(--color-accent-purple)] transition-colors line-clamp-2 leading-snug">
                                        {recent.title}
                                    </h4>
                                    <p class="text-[10px] text-[var(--color-text-muted)] mt-1 font-mono">
                                        {new Date(recent.published_at).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </a>
                        {/each}
                    </div>
                </div>

                <!-- WIDGET 2: KATEGORI BERITA -->
                <div class="bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] rounded-xl p-6 shadow-sm">
                    <h3 class="text-lg font-bold text-[var(--color-accent-primary)] mb-5 pb-2 border-b border-[var(--color-border-light)] flex items-center gap-2">
                        <Folder class="w-5 h-5" />
                        <span>Kategori Berita</span>
                    </h3>

                    <ul class="space-y-2 text-xs">
                        {#each data.categories as cat}
                            <li>
                                <a
                                    href={`/news?category=${encodeURIComponent(cat.name)}`}
                                    class="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-[var(--color-bg-primary-glare)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                                >
                                    <span class="font-medium">{cat.name}</span>
                                    <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-bg-primary-glare)] text-[var(--color-text-muted)] border border-[var(--color-border-light)]">
                                        ({cat.count})
                                    </span>
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>

            </aside>

        </div>

    </div>
</div>
