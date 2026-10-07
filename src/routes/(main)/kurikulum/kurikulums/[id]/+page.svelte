<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import type { PageData } from './$types';
	import { Calendar, Clock, FileText, ArrowLeft, Image as ImageIcon } from 'lucide-svelte';

	const { data } = $props();

	const { curriculum } = data;

	let sliderContainer: HTMLDivElement;
	let activeImageIndex = 0;

	// Sinkronisasi indikator titik saat pengguna menggeser slider secara manual (scroll)
	function handleScroll() {
		if (!sliderContainer) return;
		const index = Math.round(sliderContainer.scrollLeft / sliderContainer.clientWidth);
		activeImageIndex = index;
	}

	// Fungsi untuk berpindah slide saat indikator titik diklik
	function scrollToImage(index: number) {
		activeImageIndex = index;
		if (sliderContainer) {
			sliderContainer.scrollTo({
				left: sliderContainer.clientWidth * index,
				behavior: 'smooth'
			});
		}
	}

	const formatDate = (dateInput?: Date | string) => {
		if (!dateInput) return '-';
		return new Date(dateInput).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};
</script>

<svelte:head>
	<title>{curriculum.title || 'Detail Kurikulum'} - Portal Akademik</title>
</svelte:head>

<main
	class="{classTopSpace} min-h-screen bg-bg-primary px-4 py-10 transition-colors duration-300 sm:px-6 lg:px-8"
>
	<div class="mx-auto max-w-4xl space-y-6">
		<!-- KARTU 1: Deskripsi & Informasi Utama -->
		<article
			class="space-y-6 overflow-hidden rounded-2xl border border-border-color bg-bg-secondary p-6 shadow-xl transition-colors duration-300 sm:p-10"
		>
			<div class="border-b border-border-color pb-6">
				<div
					class="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-accent-blue uppercase"
				>
					<FileText class="h-4 w-4" />
					<span>Detail Kurikulum & Program</span>
				</div>
				<h1 class="text-2xl leading-tight font-extrabold tracking-tight text-text-main sm:text-4xl">
					{curriculum.title}
				</h1>

				<!-- Informasi Waktu -->
				<div class="mt-4 flex flex-wrap items-center gap-6 text-xs text-text-muted sm:text-sm">
					<!-- {#if curriculum.created_at} -->
					<!-- 	<div class="flex items-center gap-2"> -->
					<!-- 		<Calendar class="h-4 w-4 text-accent-blue" /> -->
					<!-- 		<span>Dibuat: {formatDate(curriculum.created_at)}</span> -->
					<!-- 	</div> -->
					<!-- {/if} -->
					{#if curriculum.updated_at}
						<div class="flex items-center gap-2">
							<Clock class="h-4 w-4 text-accent-primary" />
							<span>Diperbarui: {formatDate(curriculum.updated_at)}</span>
						</div>
					{/if}
				</div>
			</div>

			<div
				class="prose max-w-none text-base leading-relaxed whitespace-pre-line text-text-main sm:text-lg"
			>
				{@html curriculum.description}
			</div>
		</article>
		<!-- KARTU 2: Galeri Gambar (Bisa di-swipe tangan / scroll mouse horizontal) -->
		{#if curriculum.images && curriculum.images.length > 0}
			<section
				class="space-y-4 rounded-2xl border border-border-color bg-bg-secondary p-6 shadow-xl transition-colors duration-300 sm:p-8"
			>
				<div class="flex items-center justify-between">
					<h2 class="flex items-center gap-2 text-lg font-bold text-text-main">
						<ImageIcon class="h-5 w-5 text-accent-blue" />
						<span>Galeri Kurikulum</span>
					</h2>
					<span class="text-xs text-text-muted">Geser untuk melihat foto lainnya</span>
				</div>

				<!-- Container Slider -->
				<div
					class="relative overflow-hidden rounded-xl border border-border-color bg-bg-primary-glare shadow-inner"
				>
					<div
						bind:this={sliderContainer}
						onscroll={handleScroll}
						class="flex w-full snap-x snap-mandatory scrollbar-none items-center overflow-x-auto"
						style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;"
					>
						{#each curriculum.images as img, i (i)}
							<div
								class="relative flex w-full flex-shrink-0 snap-center items-center justify-center bg-black/40 p-2 sm:p-4"
							>
								<img
									src={img?.url || img}
									alt={img?.caption || `Gambar ${i + 1}`}
									class="pointer-events-none h-auto max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-md transition-all duration-300 select-none"
								/>
								{#if img?.caption}
									<div
										class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-sm text-text-main"
									>
										<p class="text-center font-medium">{img.caption}</p>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- Indikator Titik (Dots) -->
				{#if curriculum.images.length > 1}
					<div class="flex items-center justify-center gap-2 pt-2">
						{#each curriculum.images as _, i}
							<button
								onclick={() => scrollToImage(i)}
								class={`h-2 rounded-full transition-all duration-300 ${i === activeImageIndex ? 'w-6 bg-accent-blue' : 'w-2 bg-border-light'}`}
								aria-label={`Slide ${i + 1}`}
							></button>
						{/each}
					</div>
				{/if}
			</section>
		{/if}
	</div>
</main>

<style>
	/* Menyembunyikan scrollbar bawaan browser pada container slider */
	.scrollbar-none::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-none {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
