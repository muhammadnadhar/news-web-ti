<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import type { CourseMapDTO } from '$lib/dto/admin/article/kurikulum';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import { Map, Calendar, Maximize2, X, AlertCircle, FolderOpen } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// State untuk modal preview gambar
	let selectedCourseMap = $state<CourseMapDTO | null>(null);

	function openModal(item: CourseMapDTO) {
		selectedCourseMap = item;
	}

	function closeModal() {
		selectedCourseMap = null;
	}
</script>

<section class={`mx-auto ${classTopSpace} max-w-7xl px-4 py-12 sm:px-6 lg:px-8`}>
	<div class="mb-10 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div
			class="border-scitech-mint/30 bg-scitech-mint/10 text-scitech-mint mb-3 inline-flex items-center gap-2 border px-3 py-1 text-xs font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
		>
			<Map class="h-4 w-4" />
			<span>Struktur Kurikulum</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
			Peta Mata Kuliah
		</h1>
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
					class="group bg-scitech-slate/40 hover:border-scitech-mint/60 relative flex flex-col justify-between border border-border-color shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)]"
				>
					<!-- Preview Gambar -->
					<div
						class="bg-scitech-navy relative h-64 w-full overflow-hidden border-b border-border-color sm:h-80"
					>
						<img
							src={item.image_url}
							alt={item.title}
							class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
							loading="lazy"
						/>

						<div
							class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<button
								onclick={() => openModal(item)}
								class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 border border-border-color px-4 py-2 text-xs font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] transition-all active:scale-95"
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

						<div class="mt-4 border-t border-border-color/40 pt-4">
							<button
								onclick={() => openModal(item)}
								class="bg-scitech-navy/70 text-scitech-mint hover:bg-scitech-mint hover:text-scitech-navy inline-flex w-full items-center justify-center gap-2 border border-border-color px-3 py-2 text-xs font-bold transition-all hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] active:scale-95"
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
		<EmptyData
			title="Belum Ada Dokumen Penelitian"
			description="Dokumen hasil rekapitulasi riset dosen belum tersedia untuk saat ini."
			icon={FolderOpen}
		/>
	{/if}
</section>

<!-- Modal Lightbox Preview Gambar Penuh -->
{#if selectedCourseMap}
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
			class="bg-scitech-slate relative z-10 flex max-h-[90vh] max-w-5xl flex-col overflow-hidden border border-border-color shadow-[12px_12px_0px_0px_rgba(0,0,0,0.7)]"
		>
			<!-- Header Modal -->
			<div
				class="bg-scitech-navy flex items-center justify-between border-b border-border-color px-6 py-4"
			>
				<h3 class="line-clamp-1 text-sm font-bold text-text-main sm:text-base">
					{selectedCourseMap.title}
				</h3>
				<button
					onclick={closeModal}
					class="border border-transparent p-1.5 text-text-muted transition-colors hover:border-border-color hover:bg-white/10 hover:text-text-main"
					aria-label="Tutup"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Gambar Full Size -->
			<div
				class="bg-scitech-navy/90 flex max-h-[80vh] items-center justify-center overflow-auto p-4"
			>
				<img
					src={selectedCourseMap.image_url}
					alt={selectedCourseMap.title}
					class="mx-auto h-auto max-w-full border border-border-color object-contain shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]"
				/>
			</div>
		</div>
	</div>
{/if}
