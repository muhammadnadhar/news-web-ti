<script lang="ts">
	import EmptyData from '../../_components/emptyData.svelte';
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
		<div
			class="bg-scitech-mint/10 text-scitech-mint mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
		>
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

				<article
					class="bg-scitech-slate/40 hover:border-scitech-mint/40 overflow-hidden rounded-2xl border border-border-color backdrop-blur-md transition-all duration-300"
				>
					<!-- Judul & Info Tanggal -->
					<div class="bg-scitech-navy/60 border-b border-border-color/40 px-6 py-4 sm:px-8">
						<h2 class="text-xl font-bold text-text-main sm:text-2xl">{item.title}</h2>
						<div class="mt-1.5 flex items-center gap-1.5 text-xs text-text-muted">
							<Calendar class="text-scitech-cyan h-3.5 w-3.5" />
							<span>Diperbarui: {formattedDate}</span>
						</div>
					</div>

					<div class="p-6 sm:p-8">
						<!-- Gambar Bagan Organisasi -->
						{#if item.image_url}
							<div
								class="group bg-scitech-navy relative mb-6 overflow-hidden rounded-xl border border-border-color"
							>
								<img
									src={item.image_url}
									alt={item.title}
									class="mx-auto h-auto max-h-[500px] w-full object-contain"
									loading="lazy"
								/>

								<!-- Overlay Button Perbesar Gambar -->
								<div
									class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								>
									<button
										onclick={() => openModal(item.image_url!, item.title)}
										class="bg-scitech-mint text-scitech-navy inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xl transition-transform hover:scale-105 active:scale-95"
									>
										<Maximize2 class="h-4 w-4" />
										<span>Perbesar Bagan</span>
									</button>
								</div>
							</div>
						{/if}

						<!-- Deskripsi Teks Polos -->
						{#if item.description}
							<div class="bg-scitech-navy/40 rounded-xl border border-border-color/30 p-5">
								<div class="text-scitech-cyan mb-2 flex items-center gap-2 text-xs font-semibold">
									<FileText class="h-4 w-4" />
									<span>Keterangan / Deskripsi</span>
								</div>
								<p class="text-sm leading-relaxed whitespace-pre-line text-slate-300">
									{item.description}
								</p>
							</div>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<EmptyData
			title="Struktur Organisasi Belum Tersedia"
			description="Bagan struktur organisasi belum diunggah. Silakan cek kembali secara berkala."
		/>
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

		<div
			class="bg-scitech-slate relative z-10 flex max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-2xl border border-border-color shadow-2xl"
		>
			<!-- Header Modal -->
			<div
				class="bg-scitech-navy flex items-center justify-between border-b border-border-color px-6 py-4"
			>
				<h3 class="line-clamp-1 text-sm font-bold text-text-main sm:text-base">
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
			<div
				class="bg-scitech-navy/80 flex max-h-[80vh] items-center justify-center overflow-auto p-4"
			>
				<img
					src={selectedImage.url}
					alt={selectedImage.title}
					class="h-auto max-w-full rounded-lg object-contain"
				/>
			</div>
		</div>
	</div>
{/if}
