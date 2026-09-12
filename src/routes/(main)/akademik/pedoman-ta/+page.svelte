<script lang="ts">
	import type { PageData } from './$types';
	import { BookOpen, Calendar, Maximize2, X, AlertCircle, FileText } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// State untuk Modal Preview Sampul Buku / Pedoman
	let selectedImage = $state<{ url: string; title: string } | null>(null);

	function openModal(url: string, title: string) {
		selectedImage = { url, title };
	}

	function closeModal() {
		selectedImage = null;
	}
</script>

<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- HEADER HALAMAN -->
	<div class="mb-10 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div class="mb-3 inline-flex items-center gap-2 rounded-full bg-scitech-mint/10 px-3 py-1 text-xs font-semibold text-scitech-mint">
			<BookOpen class="h-4 w-4" />
			<span>Panduan Akademik</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
			Pedoman Tugas Akhir / Skripsi
		</h1>
		<p class="mt-2 text-sm text-text-muted">
			Petunjuk teknis, regulasi, dan acuan tata cara penyusunan Tugas Akhir bagi mahasiswa.
		</p>
	</div>

	<!-- DAFTAR PEDOMAN TA -->
	{#if data.pedomanList && data.pedomanList.length > 0}
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			{#each data.pedomanList as item (item.id)}
				{@const formattedDate = item.updated_at
					? new Date(item.updated_at).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})
					: '-'}

				<article class="flex flex-col justify-between overflow-hidden rounded-2xl border border-border-color bg-scitech-slate/40 backdrop-blur-md transition-all duration-300 hover:border-scitech-mint/40 hover:shadow-lg">
					<div class="p-6 sm:p-8">
						<!-- Sampul Pedoman (Jika Ada) -->
						{#if item.image_url}
							<div class="group relative mb-6 overflow-hidden rounded-xl border border-border-color bg-scitech-navy">
								<img
									src={item.image_url}
									alt={item.title}
									class="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
									loading="lazy"
								/>

								<!-- Overlay Button Zoom Sampul -->
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
						{/if}

						<!-- Title -->
						<h2 class="text-xl font-bold text-text-main line-clamp-2">{item.title}</h2>

						<!-- Date Badge -->
						<div class="mt-2 mb-4 flex items-center gap-1.5 text-xs text-text-muted">
							<Calendar class="h-3.5 w-3.5 text-scitech-cyan" />
							<span>Pembaruan: {formattedDate}</span>
						</div>

						<!-- Description -->
						{#if item.description}
							<div class="mt-4 border-t border-border-color/30 pt-4">
								<p class="whitespace-pre-line text-sm leading-relaxed text-slate-300 line-clamp-6">
									{item.description}
								</p>
							</div>
						{/if}
					</div>

					<!-- Footer Card -->
					<div class="border-t border-border-color/40 bg-scitech-navy/50 px-6 py-3.5 sm:px-8 flex items-center justify-between text-xs text-text-muted">
						<span class="flex items-center gap-1.5 text-scitech-mint font-medium">
							<FileText class="h-4 w-4" />
							Dokumen Acuan
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
			<h3 class="text-lg font-bold text-text-main">Pedoman TA Belum Tersedia</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Belum ada buku atau dokumen pedoman Tugas Akhir yang dipublikasikan. Silakan hubungi koordinator TA.
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
