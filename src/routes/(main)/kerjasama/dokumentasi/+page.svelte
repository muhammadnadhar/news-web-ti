<script lang="ts">
	import type { PageData } from './$types';
	import { Camera, Calendar, Maximize2, X, Search, AlertCircle, Image as ImageIcon } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// State pencarian judul kegiatan
	let searchQuery = $state('');

	// State Modal Preview Lightbox Foto
	let selectedMedia = $state<{ url: string; title: string; description?: string | null; date?: string | null } | null>(null);

	// Filter dokumentasi berdasarkan pencarian
	let filteredDocumentations = $derived(
		data.documentations?.filter((item) =>
			item.title.toLowerCase().includes(searchQuery.toLowerCase())
		) ?? []
	);

	function openModal(item: { image_url: string; title: string; description?: string | null; event_date?: Date | string | null }) {
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
		<div class="mb-3 inline-flex items-center gap-2 rounded-full bg-scitech-mint/10 px-3 py-1 text-xs font-semibold text-scitech-mint">
			<Camera class="h-4 w-4" />
			<span>Galeri & Dokumentasi</span>
		</div>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
					Dokumentasi Kegiatan
				</h1>
				<p class="mt-2 text-sm text-text-muted">
					Arsip foto dan catatan agenda kegiatan, seminar, praktikum, serta momen akademik fakultas.
				</p>
			</div>

			<!-- Input Pencarian -->
			{#if data.documentations && data.documentations.length > 0}
				<div class="relative min-w-[260px]">
					<Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari nama kegiatan..."
						class="w-full rounded-xl border border-border-color bg-scitech-slate/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-text-muted outline-none transition-all focus:border-scitech-mint focus:ring-1 focus:ring-scitech-mint"
					/>
				</div>
			{/if}
		</div>
	</div>

	<!-- GRID GALERI FOTO DOKUMENTASI -->
	{#if filteredDocumentations.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filteredDocumentations as item (item.id)}
				{@const formattedDate = item.event_date
					? new Date(item.event_date).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})
					: null}

				<article class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-color bg-scitech-slate/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-scitech-mint/40 hover:shadow-xl">
					<!-- Foto Container -->
					<div class="relative h-56 w-full overflow-hidden bg-scitech-navy">
						<img
							src={item.image_url}
							alt={item.title}
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							loading="lazy"
						/>

						<!-- Overlay Zoom Button -->
						<div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
							<button
								onclick={() => openModal(item)}
								class="inline-flex items-center gap-2 rounded-xl bg-scitech-mint px-4 py-2 text-xs font-bold text-scitech-navy shadow-xl transition-transform hover:scale-105 active:scale-95"
							>
								<Maximize2 class="h-4 w-4" />
								<span>Lihat Foto</span>
							</button>
						</div>

						<!-- Badge Tanggal Pelaksanaan -->
						{#if formattedDate}
							<span class="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-scitech-navy/80 px-2.5 py-1 text-[11px] font-semibold text-scitech-cyan backdrop-blur-md">
								<Calendar class="h-3 w-3" />
								<span>{formattedDate}</span>
							</span>
						{/if}
					</div>

					<!-- Content Text -->
					<div class="flex flex-1 flex-col justify-between p-5">
						<div>
							<h2 class="text-base font-bold text-white line-clamp-2" title={item.title}>
								{item.title}
							</h2>

							{#if item.description}
								<p class="mt-2 text-xs leading-relaxed text-text-muted line-clamp-3">
									{item.description}
								</p>
							{/if}
						</div>
					</div>
				</article>
			{/each}
		</div>
	{:else if searchQuery}
		<!-- EMPTY STATE PENCARIAN -->
		<div class="flex flex-col items-center justify-center rounded-2xl border border-border-color bg-scitech-slate/20 p-12 text-center backdrop-blur-md">
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
				<Search class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-bold text-white">Kegiatan Tidak Ditemukan</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Tidak ada dokumentasi kegiatan yang cocok dengan kata kunci "<span class="text-white">{searchQuery}</span>".
			</p>
		</div>
	{:else}
		<!-- EMPTY STATE KOSONG -->
		<div class="flex flex-col items-center justify-center rounded-2xl border border-border-color bg-scitech-slate/20 p-12 text-center backdrop-blur-md">
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
				<AlertCircle class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-bold text-white">Dokumentasi Belum Tersedia</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Belum ada foto atau arsip dokumentasi kegiatan yang diunggah.
			</p>
		</div>
	{/if}
</div>

<!-- MODAL LIGHTBOX / ZOOM FOTO -->
{#if selectedMedia}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<!-- Overlay Backdrop Click -->
		<button
			onclick={closeModal}
			class="absolute inset-0 h-full w-full cursor-default"
			aria-label="Tutup Pratinjau"
		></button>

		<div class="relative z-10 flex max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-2xl border border-border-color bg-scitech-slate shadow-2xl">
			<!-- Header Modal -->
			<div class="flex items-center justify-between border-b border-border-color bg-scitech-navy px-6 py-4">
				<div class="pr-4">
					<h3 class="text-sm font-bold text-white sm:text-base line-clamp-1">{selectedMedia.title}</h3>
					{#if selectedMedia.date}
						<div class="mt-0.5 flex items-center gap-1.5 text-[11px] text-scitech-cyan">
							<Calendar class="h-3 w-3" />
							<span>Pelaksanaan: {selectedMedia.date}</span>
						</div>
					{/if}
				</div>
				<button
					onclick={closeModal}
					class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-white"
					aria-label="Tutup Modal"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Media Foto Full -->
			<div class="max-h-[70vh] overflow-auto bg-scitech-navy/90 p-4 flex items-center justify-center">
				<img
					src={selectedMedia.url}
					alt={selectedMedia.title}
					class="h-auto max-w-full rounded-lg object-contain shadow-lg"
				/>
			</div>

			<!-- Deskripsi Lengkap Modal -->
			{#if selectedMedia.description}
				<div class="border-t border-border-color bg-scitech-navy/60 px-6 py-4 max-h-36 overflow-y-auto">
					<p class="whitespace-pre-line text-xs leading-relaxed text-slate-300">
						{selectedMedia.description}
					</p>
				</div>
			{/if}
		</div>
	</div>
{/if}
