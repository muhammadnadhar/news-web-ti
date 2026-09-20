<script lang="ts">
    import { Loader2, CalendarX } from 'lucide-svelte';
    import AcademicCalendarCard from './_components/AcademicCalendarCard.svelte';

    let { data } = $props();

    // Reaktif terhadap data streaming dari server
    let calendarPromise = $derived(data.calendars);
</script>

<svelte:head>
    <title>Kalender Akademik</title>
</svelte:head>

<main class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <!-- Section Banner/Header Halaman -->
    <header class="mb-10 text-center sm:text-left">
        <h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
            Kalender Akademik
        </h1>
        <p class="mt-2 text-sm text-text-muted sm:text-base">
            Informasi lengkap mengenai jadwal kegiatan akademik, perkuliahan, dan libur resmi.
        </p>
    </header>

    <section class="space-y-8">
        {#await calendarPromise}
            <!--  State Loading -->
            <div class="bg-scitech-slate/20 flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 p-16 text-center">
                <Loader2 class="h-8 w-8 animate-spin text-scitech-mint" />
                <p class="text-sm text-text-muted">Memuat data kalender akademik...</p>
            </div>
        {:then calendars}
            {#if !calendars || calendars.length === 0}
                <!-- 2. State Kosong -->
                <div class="bg-scitech-slate/20 flex flex-col items-center justify-center rounded-2xl border border-white/10 p-12 text-center">
                    <CalendarX class="mb-3 h-10 w-10 text-text-muted/50" />
                    <h3 class="text-base font-semibold text-text-main">Belum Ada Kalender Akademik</h3>
                    <p class="mt-1 text-xs text-text-muted">
                        Saat ini belum ada informasi kalender akademik aktif yang dapat ditampilkan.
                    </p>
                </div>
            {:else}
                <!-- Looping Render Komponen Card -->
                <div class="flex flex-col gap-8">
                    {#each calendars as calendarItem (calendarItem.id)}
                        <AcademicCalendarCard calendar={calendarItem} />
                    {/each}
                </div>
            {/if}
        {:catch error}
            <!-- state error -->
            <div class="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-sm text-rose-400">
                Gagal memuat kalender akademik: {error.message}
            </div>
        {/await}
    </section>
</main>
