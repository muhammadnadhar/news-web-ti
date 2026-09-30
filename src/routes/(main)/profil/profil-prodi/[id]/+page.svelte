<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import type { PageData } from './$types';
	import {
		Building2,
		ArrowLeft,
		Calendar,
		Image as ImageIcon,
		Maximize2,
		X,
		Sparkles,
		LayoutGrid,
		Tag
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
	let profilProdi = $derived(data.profilProdi);

	// State untuk Lightbox / Modal Preview Gambar
	let selectedImage = $state<{ url: string; caption?: string | null } | null>(null);

	function openLightbox(img: { url: string; caption?: string | null }) {
		selectedImage = img;
	}

	function closeLightbox() {
		selectedImage = null;
	}

	// Dynamic Class Generator berdasarkan Layout Instruction
	const getLayoutClass = (instruction: string) => {
		switch (instruction) {
			case 'GRID_2':
				return 'grid grid-cols-1 sm:grid-cols-2 gap-4';
			case 'GRID_3':
				return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
			case 'SIDE_BY_SIDE':
				return 'grid grid-cols-1 lg:grid-cols-2 gap-6 items-start';
			case 'HERO_BANNER':
				return 'flex flex-col gap-4';
			case 'FLEX_CENTER':
			default:
				return 'flex flex-wrap justify-center gap-4';
		}
	};
</script>

<svelte:head>
	<title>{profilProdi.title} | Profil Prodi</title>
</svelte:head>

<div class={`min-h-screen  px-4 py-8 text-text-main sm:px-6 lg:px-8 ${classTopSpace} `}>
	<div class="mx-auto max-w-5xl space-y-8">
		<div
			class="relative overflow-hidden rounded-3xl border border-border-color/10 bg-bg-secondary/50 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
		>
			<div
				class="bg-scitech-mint/10 pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl"
			></div>
			<div
				class="bg-scitech-cyan/10 pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full blur-3xl"
			></div>

			<div class="relative z-10 space-y-4">
				<div
					class="bg-scitech-mint/10 text-scitech-mint border-scitech-mint/20 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold"
				>
					<Building2 class="h-4 w-4" />
					<span>Profil Program Studi</span>
				</div>

				<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
					{profilProdi.title}
				</h1>

				{#if profilProdi.created_at || profilProdi.updated_at}
					<div
						class="flex items-center gap-4 border-t border-border-color/10 pt-2 text-xs text-text-muted"
					>
						<span class="flex items-center gap-1.5">
							<Calendar class="text-scitech-cyan h-3.5 w-3.5" />
							Diperbarui: {new Date(
								profilProdi.updated_at || profilProdi.created_at
							).toLocaleDateString('id-ID', {
								day: 'numeric',
								month: 'long',
								year: 'numeric'
							})}
						</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Galeri Gambar (Sesuai Display Instruction) -->
		{#if profilProdi.images && profilProdi.images.length > 0}
			<div
				class="space-y-4 rounded-3xl border border-border-color/10 bg-bg-secondary/30 p-6 backdrop-blur-xl"
			>
				<div
					class="text-scitech-mint flex items-center gap-2 border-b border-border-color/10 pb-3 text-xs font-bold"
				>
					<ImageIcon class="text-scitech-cyan h-4 w-4" />
					<span>Galeri & Visual Pendukung ({profilProdi.images.length})</span>
				</div>

				<div class={getLayoutClass(profilProdi.display_instruction)}>
					{#each profilProdi.images as img, idx}
						<div
							class="group hover:border-scitech-mint/40 hover:shadow-scitech-mint/5 relative overflow-hidden rounded-2xl border border-border-color/10 bg-black/40 transition-all hover:shadow-lg"
						>
							<!-- Visual Container -->
							<div
								class="relative flex max-h-[380px] min-h-[200px] w-full items-center justify-center overflow-hidden bg-black/60"
							>
								<img
									src={img.url}
									alt={img.caption || `Gambar ${idx + 1}`}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									loading="lazy"
								/>

								<!-- Quick Preview Button Overlay -->
								<button
									type="button"
									onclick={() => openLightbox(img)}
									class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
									title="Perbesar gambar"
								>
									<div
										class="bg-scitech-mint text-scitech-navy flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-lg transition-transform duration-200 hover:scale-105"
									>
										<Maximize2 class="h-4 w-4" />
										<span>Perbesar</span>
									</div>
								</button>
							</div>

							<!-- Caption Box -->
							{#if img.caption}
								<div
									class="bg-scitech-navy/80 flex items-start gap-2 border-t border-border-color/10 p-3 text-xs text-text-muted backdrop-blur-md"
								>
									<Tag class="text-scitech-mint mt-0.5 h-3.5 w-3.5 shrink-0" />
									<span class="line-clamp-2 leading-relaxed">{img.caption}</span>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Konten / Deskripsi Utama -->
		<div
			class="rounded-3xl border border-border-color/10 bg-bg-secondary/50 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
		>
			<div
				class="prose-headings:text-scitech-mint prose-a:text-scitech-cyan prose max-w-none text-sm leading-relaxed text-text-main prose-invert sm:text-base prose-strong:text-white"
			>
				{@html profilProdi.description}
			</div>
		</div>
	</div>
</div>

<!-- Modal Lightbox Preview Gambar -->
{#if selectedImage}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md transition-all"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="bg-scitech-navy relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-border-color/20 p-2 shadow-2xl"
		>
			<!-- Close Button -->
			<button
				type="button"
				onclick={closeLightbox}
				class="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-red-600"
			>
				<X class="h-5 w-5" />
			</button>

			<!-- Lightbox Image -->
			<div
				class="flex max-h-[75vh] items-center justify-center overflow-hidden rounded-xl bg-black"
			>
				<img
					src={selectedImage.url}
					alt={selectedImage.caption || 'Preview'}
					class="max-h-[75vh] w-auto object-contain"
				/>
			</div>

			<!-- Lightbox Caption -->
			{#if selectedImage.caption}
				<div class="mt-3 px-3 py-2 text-center text-xs font-medium text-text-main">
					{selectedImage.caption}
				</div>
			{/if}
		</div>
	</div>
{/if}
