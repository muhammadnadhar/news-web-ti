<script lang="ts">
	import type { PageData } from './$types';
	import type { CourseMapDTO } from '$lib/types/admin/article/kurikulum';
	import { Map, Calendar, Maximize2, X, AlertCircle } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// State untuk modal preview gambar
	let selectedImage = $state<{ url: string; title: string } | null>(null);

	function openModal(url: string, title: string) {
		selectedImage = { url, title };
	}

	function closeModal() {
		selectedImage = null;
	}
</script>

<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- Header Section -->
	<div class="mb-10 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div
			class="bg-scitech-mint/10 text-scitech-mint mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
		>
			<Map class="h-4 w-4" />
			<span>Struktur Kurikulum</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">Peta Mata Kuliah</h1>
		<p class="mt-2 text-sm text-text-muted">
			Visualisasi alur dan keterkaitan mata kuliah antar semester.
		</p>
	</div>

	<!-- Content Grid Section -->
	{#if data.courseMaps && data.courseMaps.length > 0}
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			{#each data.courseMaps as item (item.id)}
				{@const formattedDate = item.created_at
					? new Date(item.created_at).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})
					: '-'}

				<article
					class="group bg-scitech-slate/40 hover:border-scitech-mint/50 flex flex-col overflow-hidden rounded-2xl border border-border-color backdrop-blur-md transition-all duration-300"
				>
					<!-- Preview Gambar -->
					<div class="bg-scitech-navy relative h-64 w-full overflow-hidden sm:h-80">
						<img
							src={item.image_url}
							alt={item.title}
							class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
							loading="lazy"
						/>

						<!-- Overlay & Tombol Perbesar -->
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<button
								onclick={() => openModal(item.image_url, item.title)}
								class="bg-scitech-mint text-scitech-navy inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
							>
								<Maximize2 class="h-4 w-4" />
								<span>Perbesar Peta</span>
							</button>
						</div>
					</div>

					<!-- Informasi Card -->
					<div class="flex flex-1 flex-col justify-between p-6">
						<div>
							<div class="mb-2 flex items-center gap-1.5 text-xs text-text-muted">
								<Calendar class="text-scitech-cyan h-3.5 w-3.5" />
								<span>Diterbitkan: {formattedDate}</span>
							</div>
							<h2
								class="group-hover:text-scitech-mint text-lg font-bold text-text-main transition-colors sm:text-xl"
							>
								{item.title}
							</h2>
						</div>

						<div class="mt-4 border-t border-border-color/30 pt-4">
							<button
								onclick={() => openModal(item.image_url, item.title)}
								class="text-scitech-mint hover:text-scitech-mint-hover inline-flex items-center gap-1.5 text-xs font-semibold"
							>
								<span>Lihat Ukuran Penuh</span>
								<Maximize2 class="h-3.5 w-3.5" />
							</button>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<!-- Empty State jika data kosong -->
		<div
			class="bg-scitech-slate/20 flex flex-col items-center justify-center rounded-2xl border border-border-color p-12 text-center backdrop-blur-md"
		>
			<div
				class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500"
			>
				<AlertCircle class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-bold text-text-main">Belum Ada Peta Mata Kuliah</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Data peta mata kuliah belum diunggah. Silakan cek kembali secara berkala.
			</p>
		</div>
	{/if}
</section>

<!-- Modal Lightbox Preview Gambar Penuh -->
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

		<div
			class="bg-scitech-slate relative z-10 max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border border-border-color shadow-2xl"
		>
			<!-- Header Modal -->
			<div
				class="bg-scitech-navy/80 flex items-center justify-between border-b border-border-color px-6 py-4"
			>
				<h3 class="line-clamp-1 text-sm font-bold text-text-main sm:text-base">
					{selectedImage.title}
				</h3>
				<button
					onclick={closeModal}
					class="rounded-lg p-1 text-text-muted transition-colors hover:bg-white/10 hover:text-text-main"
					aria-label="Tutup"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Gambar Full Size -->
			<div class="max-h-[80vh] overflow-auto p-4">
				<img
					src={selectedImage.url}
					alt={selectedImage.title}
					class="mx-auto h-auto max-w-full rounded-lg object-contain"
				/>
			</div>
		</div>
	</div>
{/if}
