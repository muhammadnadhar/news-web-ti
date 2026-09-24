<script lang="ts">
	import { Loader2, CalendarX } from 'lucide-svelte';
	import FormAcademic from './_components/formAcademic.svelte';
	import { classTopSpace } from '$lib/constants.js';
	import EmptyData from '../../_components/emptyData.svelte';

	let { data } = $props();

	// Reaktif terhadap data streaming dari server
	let calendarPromise = $derived(data.calendars);
</script>

<svelte:head>
	<title>Kalender Akademik</title>
</svelte:head>

<main class={`${classTopSpace} mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8`}>
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
			<div
				class="bg-scitech-slate/20 flex flex-col items-center justify-center gap-3 border border-border-color p-16 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]"
			>
				<Loader2 class="text-scitech-mint h-8 w-8 animate-spin" />
				<p class="text-sm text-text-muted">Memuat data kalender akademik...</p>
			</div>
		{:then calendars}
			<!-- Gunakan Array.isArray untuk memastikan variabel bernilai Array -->
			{#if !Array.isArray(calendars) || calendars.length === 0}
				<EmptyData
					title="Belum Ada Kalender Akademik"
					description="	Saat ini belum ada informasi kalender akademik aktif yang dapat ditampilkan."
				/>
			{:else}
				<div class="flex flex-col gap-8">
					{#each calendars as calendarItem (calendarItem.id)}
						<FormAcademic calendar={calendarItem} />
					{/each}
				</div>
			{/if}
		{:catch error}
			<!-- State Error -->
			<div
				class="border border-status-error/30 bg-status-error/10 p-6 text-center text-sm text-status-error shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
			>
				Gagal memuat kalender akademik: {error.message}
			</div>
		{/await}
	</section>
</main>
