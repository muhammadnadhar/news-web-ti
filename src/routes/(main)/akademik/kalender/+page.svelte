<script lang="ts">
	import type { PageData } from './$types';
	import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Maximize2, X, AlertCircle } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Reference elemen container scroll gambar
	let scrollContainer = $state<HTMLDivElement | null>(null);

	// State untuk Modal Lightbox Preview Gambar
	let selectedImage = $state<string | null>(null);

	// Ekstrak URL Gambar jika ada dalam tag HTML `description` untuk dibuatkan carousel
	let extractedImages = $derived.by(() => {
		const htmlContent = data.activeCalendar?.description;
		if (!htmlContent) return [];

		const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
		const images: string[] = [];
		let match;

		while ((match = imgRegex.exec(htmlContent)) !== null) {
			images.push(match[1]);
		}
		return images;
	});

	// Fungsi Navigasi Scroll Kanan - Kiri
	function scrollLeft() {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: -350, behavior: 'smooth' });
		}
	}

	function scrollRight() {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: 350, behavior: 'smooth' });
		}
	}

	function openModal(url: string) {
		selectedImage = url;
	}

	function closeModal() {
		selectedImage = null;
	}
</script>

<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- HEADER HALAMAN -->
	<div class="mb-10 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div class="mb-3 inline-flex items-center gap-2 rounded-full bg-scitech-mint/10 px-3 py-1 text-xs font-semibold text-scitech-mint">
			<Calendar class="h-4 w-4" />
			<span>Agenda & Jadwal Akademik</span>
		</div>
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
					{data.activeCalendar?.title ?? 'Kalender Akademik'}
				</h1>
				<p class="mt-2 text-sm text-text-muted">
					Jadwal kegiatan perkuliahan, ujian, dan agenda penting selama semester berjalan.
				</p>
			</div>

			{#if data.activeCalendar?.is_active}
				<div class="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-scitech-mint/30 bg-scitech-mint/10 px-3.5 py-2 text-xs font-bold text-scitech-mint">
					<CheckCircle2 class="h-4 w-4" />
					<span>Sedang Berlaku</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- KONTEN KALENDER AKADEMIK -->
	{#if data.activeCalendar}
		<div class="space-y-10">
			<!-- SECTION SLIDER GAMBAR SCROLL KANAN-KIRI (JIKA ADA GAMBAR) -->
			{#if extractedImages.length > 0}
				<div class="rounded-2xl border border-border-color bg-scitech-slate/40 p-6 backdrop-blur-md">
					<div class="mb-4 flex items-center justify-between">
						<div>
							<h2 class="text-lg font-bold text-text-main">Lembar / Gambar Kalender</h2>
							<p class="text-xs text-text-muted">Geser ke kanan/kiri untuk melihat lembaran kalender akademik.</p>
						</div>

						<!-- Tombol Navigasi Scroll -->
						<div class="flex items-center gap-2">
							<button
								onclick={scrollLeft}
								class="rounded-xl border border-border-color bg-scitech-navy p-2 text-text-muted transition-colors hover:border-scitech-mint hover:text-text-main"
								aria-label="Scroll Kiri"
							>
								<ChevronLeft class="h-5 w-5" />
							</button>
							<button
								onclick={scrollRight}
								class="rounded-xl border border-border-color bg-scitech-navy p-2 text-text-muted transition-colors hover:border-scitech-mint hover:text-text-main"
								aria-label="Scroll Kanan"
							>
								<ChevronRight class="h-5 w-5" />
							</button>
						</div>
					</div>

					<!-- Container Scrollable Horizontal -->
					<div
						bind:this={scrollContainer}
						class="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-track-scitech-navy scrollbar-thumb-scitech-mint/40"
					>
						{#each extractedImages as imgUrl, idx (idx)}
							<div class="group relative min-w-[280px] max-w-[360px] flex-shrink-0 snap-start overflow-hidden rounded-xl border border-border-color bg-scitech-navy sm:min-w-[320px]">
								<img
									src={imgUrl}
									alt="Lembar Kalender {idx + 1}"
									class="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-96"
									loading="lazy"
								/>

								<!-- Overlay Button Zoom Gambar -->
								<div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
									<button
										onclick={() => openModal(imgUrl)}
										class="inline-flex items-center gap-2 rounded-xl bg-scitech-mint px-4 py-2 text-xs font-bold text-scitech-navy shadow-xl transition-transform hover:scale-105 active:scale-95"
									>
										<Maximize2 class="h-4 w-4" />
										<span>Perbesar Gambar</span>
									</button>
								</div>

								<!-- Badge Nomor Lembaran -->
								<span class="absolute bottom-3 left-3 rounded-md bg-scitech-navy/80 px-2.5 py-1 text-[11px] font-semibold text-text-main backdrop-blur-md">
									Halaman {idx + 1}
								</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- SECTION DOKUMEN / TABEL RINCIAN HTML -->
			{#if data.activeCalendar.description}
				<div class="rounded-2xl border border-border-color bg-scitech-slate/40 p-6 backdrop-blur-md sm:p-8">
					<h2 class="mb-6 text-xl font-bold text-text-main border-b border-border-color/40 pb-3">Rincian Agenda Akademik</h2>
					<div class="prose prose-invert prose-scitech max-w-none overflow-x-auto">
						{@html data.activeCalendar.description}
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<!-- EMPTY STATE -->
		<div class="flex flex-col items-center justify-center rounded-2xl border border-border-color bg-scitech-slate/20 p-12 text-center backdrop-blur-md">
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
				<AlertCircle class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-bold text-text-main">Kalender Akademik Belum Diterbitkan</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Belum ada kalender akademik aktif untuk periode ini. Silakan hubungi bagian tata usaha/akademik.
			</p>
		</div>
	{/if}
</div>

<!-- MODAL LIGHTBOX / ZOOM GAMBAR -->
{#if selectedImage}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<!-- Overlay Click to Close -->
		<button
			onclick={closeModal}
			class="absolute inset-0 h-full w-full cursor-default"
			aria-label="Tutup Pratinjau"
		></button>

		<div class="relative z-10 flex max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-2xl border border-border-color bg-scitech-slate shadow-2xl">
			<!-- Header Modal -->
			<div class="flex items-center justify-between border-b border-border-color bg-scitech-navy px-6 py-4">
				<h3 class="text-sm font-bold text-text-main sm:text-base">Pratinjau Lembar Kalender</h3>
				<button
					onclick={closeModal}
					class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-main"
					aria-label="Tutup Modal"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Gambar Penuh -->
			<div class="max-h-[80vh] overflow-auto p-4 bg-scitech-navy/80 flex items-center justify-center">
				<img
					src={selectedImage}
					alt="Kalender Akademik Full"
					class="h-auto max-w-full rounded-lg object-contain"
				/>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Styling kustom untuk tabel & elemen HTML yang di-render di {@html} */
	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
	:global(.prose th) {
		background-color: rgba(15, 23, 42, 0.8);
		color: #2dd4bf;
		padding: 0.75rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		text-align: left;
		font-size: 0.875rem;
	}
	:global(.prose td) {
		padding: 0.75rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: #cbd5e1;
		font-size: 0.875rem;
	}
	:global(.prose tr:nth-child(even)) {
		background-color: rgba(255, 255, 255, 0.02);
	}
</style>
