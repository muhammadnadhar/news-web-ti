<script lang="ts">
	import type { PageData } from './$types';
	import { Network, Calendar, Maximize2, X, AlertCircle, FileText } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// State untuk Modal Lightbox Zoom Gambar
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
			<Network class="h-4 w-4" />
			<span>Tata Kelola</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
			Struktur Organisasi
		</h1>
		<p class="mt-2 text-sm text-text-muted">
			Bagan alir tata kelola dan susunan hierarki kepemimpinan Program Studi.
		</p>
	</div>

	<!-- DAFTAR STRUKTUR ORGANISASI -->
	{#if data.orgStructures && data.orgStructures.length > 0}
		<div class="space-y-12">
			{#each data.orgStructures as item (item.id)}
				{@const formattedDate = item.created_at
					? new Date(item.created_at).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})
					: '-'}

				<article class="overflow-hidden rounded-2xl border border-border-color bg-scitech-slate/40 backdrop-blur-md transition-all duration-300 hover:border-scitech-mint/40">
					<!-- Judul & Info Tanggal -->
					<div class="border-b border-border-color/40 bg-scitech-navy/60 px-6 py-4 sm:px-8">
						<h2 class="text-xl font-bold text-text-main sm:text-2xl">{item.title}</h2>
						<div class="mt-1.5 flex items-center gap-1.5 text-xs text-text-muted">
							<Calendar class="h-3.5 w-3.5 text-scitech-cyan" />
							<span>Diperbarui: {formattedDate}</span>
						</div>
					</div>

					<div class="p-6 sm:p-8">
						<!-- Gambar Bagan Organisasi -->
						{#if item.image_url}
							<div class="group relative mb-6 overflow-hidden rounded-xl border border-border-color bg-scitech-navy">
								<img
									src={item.image_url}
									alt={item.title}
									class="h-auto w-full object-contain max-h-[500px] mx-auto"
									loading="lazy"
								/>

								<!-- Overlay Button Perbesar Gambar -->
								<div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
									<button
										onclick={() => openModal(item.image_url!, item.title)}
										class="inline-flex items-center gap-2 rounded-xl bg-scitech-mint px-4 py-2.5 text-xs font-bold text-scitech-navy shadow-xl transition-transform hover:scale-105 active:scale-95"
									>
										<Maximize2 class="h-4 w-4" />
										<span>Perbesar Bagan</span>
									</button>
								</div>
							</div>
						{/if}

						<!-- Deskripsi Teks Polos -->
						{#if item.description}
							<div class="rounded-xl border border-border-color/30 bg-scitech-navy/40 p-5">
								<div class="mb-2 flex items-center gap-2 text-xs font-semibold text-scitech-cyan">
									<FileText class="h-4 w-4" />
									<span>Keterangan / Deskripsi</span>
								</div>
								<p class="whitespace-pre-line text-sm leading-relaxed text-slate-300">
									{item.description}
								</p>
							</div>
						{/if}
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
			<h3 class="text-lg font-bold text-text-main">Struktur Organisasi Belum Tersedia</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Bagan struktur organisasi belum diunggah. Silakan cek kembali secara berkala.
			</p>
		</div>
	{/if}
</div>

<!-- MODAL LIGHTBOX / PREVIEW GAMBAR BAGAN -->
{#if selectedImage}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<!-- Overlay untuk menutup modal jika area luar diklik -->
		<button
			onclick={closeModal}
			class="absolute inset-0 h-full w-full cursor-default"
			aria-label="Tutup Pratinjau"
		></button>

		<div class="relative z-10 flex max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-2xl border border-border-color bg-scitech-slate shadow-2xl">
			<!-- Header Modal -->
			<div class="flex items-center justify-between border-b border-border-color bg-scitech-navy px-6 py-4">
				<h3 class="text-sm font-bold text-text-main sm:text-base line-clamp-1">
					{selectedImage.title}
				</h3>
				<button
					onclick={closeModal}
					class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-main"
					aria-label="Tutup Modal"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Konten Gambar Penuh -->
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
