<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import type { PageData } from './$types';
	import { Briefcase, Calendar, Maximize2, X, AlertCircle, FileCheck } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// State untuk Modal Preview Sampul Pedoman KKP
	let selectedImage = $state<{ url: string; title: string } | null>(null);

	function openModal(url: string, title: string) {
		selectedImage = { url, title };
	}

	function closeModal() {
		selectedImage = null;
	}
</script>
 
<div class={`${classTopSpace} mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8`}>
	<div class="mb-10 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div class="mb-3 inline-flex items-center gap-2 rounded-full bg-scitech-mint/10 px-3 py-1 text-xs font-semibold text-scitech-mint">
			<Briefcase class="h-4 w-4" />
			<span>Panduan Magang & Industri</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
			Pedoman Kuliah Kerja Praktek (KKP)
		</h1>
		<p class="mt-2 text-sm text-text-muted">
			Petunjuk pelaksanaan, syarat administrasi, dan alur pelaporan Kuliah Kerja Praktek / Kerja Lapangan.
		</p>
	</div>

	{#if data.pedomanKkpList && data.pedomanKkpList.length > 0}
		<div class="space-y-12">
			{#each data.pedomanKkpList as item, index (item.id)}
				{@const formattedDate = item.updated_at
					? new Date(item.updated_at).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})
					: '-'}

				<article class="overflow-hidden rounded-2xl border border-border-color bg-scitech-slate/40 backdrop-blur-md transition-all duration-300 hover:border-scitech-mint/40">
					<!-- Sub Header Item -->
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border-color/40 bg-scitech-navy/60 px-6 py-4 sm:px-8 gap-2">
						<div class="flex items-center gap-3">
							<span class="flex h-8 w-8 items-center justify-center rounded-xl bg-scitech-mint/10 text-xs font-bold text-scitech-mint border border-scitech-mint/20">
								#{index + 1}
							</span>
							<h2 class="text-lg font-bold text-text-main sm:text-xl">{item.title}</h2>
						</div>
						<div class="flex items-center gap-1.5 text-xs text-text-muted self-start sm:self-auto">
							<Calendar class="h-3.5 w-3.5 text-scitech-cyan" />
							<span>Pembaruan: {formattedDate}</span>
						</div>
					</div>

					<div class="p-6 sm:p-8">
						<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
							<!-- Sampul Pedoman (jika ada) -->
							{#if item.image_url}
								<div class="lg:col-span-4">
									<div class="group relative overflow-hidden rounded-xl border border-border-color bg-scitech-navy shadow-lg">
										<img
											src={item.image_url}
											alt={item.title}
											class="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
										/>
										<!-- Overlay Button Zoom -->
										<div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
											<button
												onclick={() => openModal(item.image_url!, item.title)}
												class="inline-flex items-center gap-2 rounded-xl bg-scitech-mint px-4 py-2 text-xs font-bold text-scitech-navy shadow-xl transition-transform hover:scale-105 active:scale-95"
											>
												<Maximize2 class="h-4 w-4" />
												<span>Lihat Sampul</span>
											</button>
										</div>
									</div>
								</div>
							{/if}

							<!-- Deskripsi Rich Text / HTML -->
							<div class={item.image_url ? 'lg:col-span-8' : 'lg:col-span-12'}>
								{#if item.description}
									<div class="prose prose-invert prose-scitech max-w-none">
										{@html item.description}
									</div>
								{:else}
									<p class="text-sm italic text-text-muted">Tidak ada rincian deskripsi tambahan.</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- Footer Card -->
					<div class="border-t border-border-color/30 bg-scitech-navy/40 px-6 py-3 sm:px-8 flex items-center justify-between text-xs text-text-muted">
						<span class="inline-flex items-center gap-1.5 text-scitech-cyan font-medium">
							<FileCheck class="h-4 w-4" />
							Panduan Resmi KKP
						</span>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<!-- EMPTY STATE -->
		<div class="flex flex-col items-center justify-center rounded-2xl border border-border-color bg-scitech-slate/20 p-12 text-center backdrop-blur-md">
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
				<AlertCircle class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-bold text-text-main">Pedoman KKP Belum Tersedia</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Belum ada informasi atau dokumen pedoman KKP yang diterbitkan. Silakan hubungi koordinator KKP.
			</p>
		</div>
	{/if}
</div>

<!-- MODAL PREVIEW SAMPUL -->
{#if selectedImage}
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

		<div class="relative z-10 flex max-h-[90vh] max-w-3xl flex-col overflow-hidden rounded-2xl border border-border-color bg-scitech-slate shadow-2xl">
			<!-- Header Modal -->
			<div class="flex items-center justify-between border-b border-border-color bg-scitech-navy px-6 py-4">
				<h3 class="text-sm font-bold text-text-main sm:text-base line-clamp-1">{selectedImage.title}</h3>
				<button
					onclick={closeModal}
					class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-main"
					aria-label="Tutup Modal"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Gambar Sampul -->
			<div class="max-h-[80vh] overflow-auto p-4 bg-scitech-navy/80 flex items-center justify-center">
				<img
					src={selectedImage.url}
					alt={selectedImage.title}
					class="h-auto max-w-full rounded-lg object-contain"
				/>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Styling typography untuk mendukung elemen Rich Text (HTML) di {@html} */
	:global(.prose h1),
	:global(.prose h2),
	:global(.prose h3) {
		color: #ffffff;
		font-weight: 700;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose h3) {
		font-size: 1.125rem;
		color: #2dd4bf;
	}
	:global(.prose p) {
		color: #cbd5e1;
		line-height: 1.7;
		margin-bottom: 0.75rem;
	}
	:global(.prose ul) {
		list-style-type: disc;
		padding-left: 1.25rem;
		margin-bottom: 0.75rem;
		color: #cbd5e1;
	}
	:global(.prose ol) {
		list-style-type: decimal;
		padding-left: 1.25rem;
		margin-bottom: 0.75rem;
		color: #cbd5e1;
	}
	:global(.prose li) {
		margin-bottom: 0.25rem;
	}
	:global(.prose a) {
		color: #38bdf8;
		text-decoration: underline;
	}
</style>
