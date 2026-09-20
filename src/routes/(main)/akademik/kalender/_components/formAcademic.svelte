<script lang="ts">
	import type { AcademicCalendarWithImagesDTO } from '$lib/repository/admin/article/akedemik/kalender';
    import { Calendar, Image as ImageIcon, ExternalLink } from 'lucide-svelte';

    let { calendar }: { calendar: AcademicCalendarWithImagesDTO } = $props();

    // Gambar utama untuk pratinjau (gambar pertama jika ada)
    let selectedImage = $state(calendar.images[0]?.image_url || null);
</script>

<article class="bg-scitech-slate/30 border-white/10 overflow-hidden rounded-2xl border backdrop-blur-md transition-all hover:border-white/20">
    <div class="p-6 sm:p-8">
        <!-- Header Item: Judul & Tanggal -->
        <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <div class="mb-2 flex items-center gap-2 text-xs text-scitech-mint">
                    <Calendar class="h-4 w-4" />
                    <span>Kalender Akademik Aktif</span>
                </div>
                <h2 class="text-xl font-bold text-text-main sm:text-2xl">
                    {calendar.title}
                </h2>
            </div>
        </div>

        <!-- Deskripsi -->
        {#if calendar.description}
            <p class="mt-3 text-sm text-text-muted leading-relaxed">
                {calendar.description}
            </p>
        {/if}

        <!-- Bagian Galeri Gambar Kalender -->
        {#if calendar.images && calendar.images.length > 0}
            <div class="mt-6 space-y-4">
                <!-- Frame Pratinjau Gambar Utama -->
                {#if selectedImage}
                    <div class="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
                        <img
                            src={selectedImage}
                            alt={calendar.title}
                            class="max-h-[600px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <a
                            href={selectedImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="absolute bottom-3 right-3 bg-scitech-navy/80 hover:bg-scitech-navy flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all"
                        >
                            <ExternalLink class="h-3.5 w-3.5" />
                            <span>Buka Ukuran Penuh</span>
                        </a>
                    </div>
                {/if}

                <!-- Thumbnail Selector (Jika terdapat lebih dari 1 gambar) -->
                {#if calendar.images.length > 1}
                    <div class="flex items-center gap-3 overflow-x-auto pb-2">
                        {#each calendar.images as img (img.id)}
                            <button
                                type="button"
                                onclick={() => (selectedImage = img.image_url)}
                                class={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border transition-all ${
                                    selectedImage === img.image_url
                                        ? 'border-scitech-mint ring-2 ring-scitech-mint/30'
                                        : 'border-white/10 opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img src={img.image_url} alt="Thumbnail" class="h-full w-full object-cover" />
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
        {:else}
            <!-- Empty state jika tidak ada gambar -->
            <div class="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-text-muted">
                <ImageIcon class="mb-2 h-8 w-8 text-text-muted/40" />
                <span>Belum ada berkas/gambar lampiran untuk kalender ini.</span>
            </div>
        {/if}
    </div>
</article>
