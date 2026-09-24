<script lang="ts">
	import type { PageData } from './$types';
	import { Camera, Search, Maximize2, Calendar, AlertCircle, X, ExternalLink } from 'lucide-svelte';
	interface Props {
		data: PageData;
	}
	import EmptyData from '../../_components/emptyData.svelte';

	let { data }: Props = $props();

	// State pencarian judul kegiatan
	let searchQuery = $state('');

	// State Modal Preview Lightbox Foto
	let selectedMedia = $state<{
		url: string;
		title: string;
		description?: string | null;
		date?: string | null;
	} | null>(null);

	// Filter dokumentasi berdasarkan pencarian
	let filteredDocumentations = $derived(
		data.documentations?.filter((item) =>
			item.title.toLowerCase().includes(searchQuery.toLowerCase())
		) ?? []
	);

	function openModal(item: {
		image_url: string;
		title: string;
		description?: string | null;
		event_date?: Date | string | null;
	}) {
		const formattedDate = item.event_date
			? new Date(item.event_date).toLocaleDateString('id-ID', {
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				})
			: null;

		selectedMedia = {
			url: item.image_url,
			title: item.title,
			description: item.description,
			date: formattedDate
		};
	}

	function closeModal() {
		selectedMedia = null;
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- HEADER HALAMAN -->
	<div class="mb-10 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div
			class="border-scitech-mint/30 bg-scitech-mint/10 text-scitech-mint mb-3 inline-flex items-center gap-2 border px-3 py-1 text-xs font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
		>
			<Camera class="h-4 w-4" />
			<span>Galeri & Dokumentasi</span>
		</div>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
					Dokumentasi Kegiatan
				</h1>
				<p class="mt-2 text-sm text-text-muted">
					Arsip foto dan catatan agenda kegiatan, seminar, praktikum, serta momen akademik fakultas.
				</p>
			</div>

			<!-- Input Pencarian -->
			{#if data.documentations && data.documentations.length > 0}
				<div class="relative min-w-[260px]">
					<Search class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-text-muted" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari nama kegiatan..."
						class="bg-scitech-slate/60 focus:border-scitech-mint focus:ring-scitech-mint w-full border border-border-color py-2.5 pr-4 pl-10 text-xs text-text-main placeholder-text-muted shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all outline-none focus:ring-1"
					/>
				</div>
			{/if}
		</div>
	</div>

	<!-- GRID GALERI FOTO DOKUMENTASI -->
	{#if filteredDocumentations.length > 0}
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filteredDocumentations as item (item.id)}
				{@const formattedDate = item.event_date
					? new Date(item.event_date).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})
					: null}

				<article
					class="group bg-scitech-slate/40 hover:border-scitech-mint/60 relative flex flex-col justify-between border border-border-color shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)]"
				>
					<!-- Foto Container -->
					<div
						class="bg-scitech-navy relative h-56 w-full overflow-hidden border-b border-border-color"
					>
						<img
							src={item.image_url}
							alt={item.title}
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							loading="lazy"
						/>

						<!-- Overlay Zoom Button -->
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<button
								onclick={() => openModal(item)}
								class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 border border-border-color px-4 py-2 text-xs font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] transition-all active:scale-95"
							>
								<Maximize2 class="h-4 w-4" />
								<span>Lihat Foto</span>
							</button>
						</div>

						<!-- Badge Tanggal Pelaksanaan -->
						{#if formattedDate}
							<span
								class="bg-scitech-navy/90 text-scitech-cyan absolute bottom-3 left-3 inline-flex items-center gap-1.5 border border-border-color px-2.5 py-1 text-[11px] font-semibold shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] backdrop-blur-md"
							>
								<Calendar class="h-3 w-3" />
								<span>{formattedDate}</span>
							</span>
						{/if}
					</div>

					<!-- Content Text -->
					<div class="flex flex-1 flex-col justify-between p-5">
						<div class="space-y-2">
							<h2 class="line-clamp-2 text-base font-bold text-text-main" title={item.title}>
								{item.title}
							</h2>

							{#if item.description}
								<p class="line-clamp-3 text-xs leading-relaxed text-text-muted">
									{item.description}
								</p>
							{/if}
						</div>

						<!-- Tautan Google Drive (Jika ada) -->
						{#if item.link_drive}
							<div class="mt-4 border-t border-border-color/40 pt-3">
								<a
									href={item.link_drive}
									target="_blank"
									rel="noopener noreferrer"
									class="bg-scitech-navy/70 text-scitech-mint hover:bg-scitech-mint hover:text-scitech-navy inline-flex w-full items-center justify-center gap-2 border border-border-color px-3 py-2 text-xs font-bold transition-all hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] active:scale-95"
								>
									<ExternalLink class="h-3.5 w-3.5" />
									<span>Buka Google Drive</span>
								</a>
							</div>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{:else if searchQuery}
		<!-- EMPTY STATE PENCARIAN -->
		<div
			class="bg-scitech-slate/20 flex flex-col items-center justify-center border border-border-color p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] backdrop-blur-md"
		>
			<div
				class="mb-4 flex h-12 w-12 items-center justify-center border border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
			>
				<Search class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-bold text-text-main">Kegiatan Tidak Ditemukan</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Tidak ada dokumentasi kegiatan yang cocok dengan kata kunci "<span class="text-text-main"
					>{searchQuery}</span
				>".
			</p>
		</div>
		<EmptyData />
	{:else}
		<!-- EMPTY STATE KOSONG -->
		<EmptyData
			title="Dokumentasi Belum Tersedia"
			description="Belum ada foto atau arsip dokumentasi kegiatan yang diunggah."
		/>
	{/if}
</div>

<!-- modal lightbox / zoom foto -->
{#if selectedMedia}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<button
			onclick={closeModal}
			class="absolute inset-0 h-full w-full cursor-default"
			aria-label="Tutup Pratinjau"
		></button>

		<div
			class="bg-scitech-slate relative z-10 flex max-h-[90vh] max-w-4xl flex-col overflow-hidden border border-border-color shadow-[12px_12px_0px_0px_rgba(0,0,0,0.7)]"
		>
			<div
				class="bg-scitech-navy flex items-center justify-between border-b border-border-color px-6 py-4"
			>
				<div class="pr-4">
					<h3 class="line-clamp-1 text-sm font-bold text-text-main sm:text-base">
						{selectedMedia.title}
					</h3>
					{#if selectedMedia.date}
						<div class="text-scitech-cyan mt-0.5 flex items-center gap-1.5 text-[11px]">
							<Calendar class="h-3 w-3" />
							<span>Pelaksanaan: {selectedMedia.date}</span>
						</div>
					{/if}
				</div>
				<button
					onclick={closeModal}
					class="border border-transparent p-1.5 text-text-muted transition-colors hover:border-border-color hover:bg-white/10 hover:text-text-main"
					aria-label="Tutup Modal"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Media Foto Full -->
			<div
				class="bg-scitech-navy/90 flex max-h-[65vh] items-center justify-center overflow-auto p-4"
			>
				<img
					src={selectedMedia.url}
					alt={selectedMedia.title}
					class="h-auto max-w-full border border-border-color object-contain shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]"
				/>
			</div>

			<!-- Deskripsi Lengkap & Tautan Drive di Modal -->
			{#if selectedMedia.description || selectedMedia.link_drive}
				<div
					class="bg-scitech-navy/60 flex max-h-40 flex-col gap-3 overflow-y-auto border-t border-border-color px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
				>
					{#if selectedMedia.description}
						<p class="flex-1 text-xs leading-relaxed whitespace-pre-line text-slate-300">
							{selectedMedia.description}
						</p>
					{/if}

					{#if selectedMedia.link_drive}
						<a
							href={selectedMedia.link_drive}
							target="_blank"
							rel="noopener noreferrer"
							class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex shrink-0 items-center justify-center gap-2 border border-border-color px-4 py-2 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] transition-all active:scale-95"
						>
							<ExternalLink class="h-4 w-4" />
							<span>Buka Google Drive</span>
						</a>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
