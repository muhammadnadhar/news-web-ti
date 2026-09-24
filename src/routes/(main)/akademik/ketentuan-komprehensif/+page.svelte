<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import { UserPlus, Calendar, Maximize2, X, AlertCircle, FileText } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// State Modal Preview Gambar Poster / Flyer Rekrutmen
	let selectedImage = $state<{ url: string; title: string } | null>(null);

	function openModal(url: string, title: string) {
		selectedImage = { url, title };
	}

	function closeModal() {
		selectedImage = null;
	}
</script>

<div class={`${classTopSpace}mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8`}>
	<!-- HEADER HALAMAN -->
	<div class="mb-10 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div
			class="bg-scitech-mint/10 text-scitech-mint mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
		>
			<UserPlus class="h-4 w-4" />
			<span>Informasi Karir & Ketentuan</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
			Rekrutmen & Ketentuan
		</h1>
		<p class="mt-2 text-sm text-text-muted">
			Peluang karir, rekrutmen asisten laboratorium, pengajar, serta pengumuman ketentuan terkait.
		</p>
	</div>

	{#if data.recruitmentList && data.recruitmentList.length > 0}
		<div class="space-y-12">
			{#each data.recruitmentList as item, index (item.id)}
				{@const formattedDate = item.updated_at
					? new Date(item.updated_at).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})
					: '-'}

				<article
					class="bg-scitech-slate/40 hover:border-scitech-mint/40 overflow-hidden rounded-2xl border border-border-color backdrop-blur-md transition-all duration-300"
				>
					<!-- Header Item -->
					<div
						class="bg-scitech-navy/60 flex flex-col gap-2 border-b border-border-color/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
					>
						<div class="flex items-center gap-3">
							<span
								class="bg-scitech-mint/10 text-scitech-mint border-scitech-mint/20 flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-bold"
							>
								#{index + 1}
							</span>
							<h2 class="text-lg font-bold text-text-main sm:text-xl">{item.title}</h2>
						</div>
						<div class="flex items-center gap-1.5 self-start text-xs text-text-muted sm:self-auto">
							<Calendar class="text-scitech-cyan h-3.5 w-3.5" />
							<span>Dipublikasikan: {formattedDate}</span>
						</div>
					</div>

					<!-- Content Grid -->
					<div class="p-6 sm:p-8">
						<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
							<!-- Poster/Flyer Rekrutmen (Jika Ada) -->
							{#if item.image_url}
								<div class="lg:col-span-5">
									<div
										class="group bg-scitech-navy relative overflow-hidden rounded-xl border border-border-color shadow-lg"
									>
										<img
											src={item.image_url}
											alt={item.title}
											class="h-auto max-h-[450px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
										/>
										<!-- Overlay Button Zoom -->
										<div
											class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
										>
											<button
												onclick={() => openModal(item.image_url!, item.title)}
												class="bg-scitech-mint text-scitech-navy inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-xl transition-transform hover:scale-105 active:scale-95"
											>
												<Maximize2 class="h-4 w-4" />
												<span>Perbesar Poster</span>
											</button>
										</div>
									</div>
								</div>
							{/if}

							<!-- Detail Deskripsi Rich Text HTML -->
							<div class={item.image_url ? 'lg:col-span-7' : 'lg:col-span-12'}>
								{#if item.description}
									<div class="prose-scitech prose max-w-none prose-invert">
										{@html item.description}
									</div>
								{:else}
									<p class="text-sm text-text-muted italic">
										Tidak ada rincian deskripsi tambahan.
									</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- Footer Card -->
					<div
						class="bg-scitech-navy/40 flex items-center justify-between border-t border-border-color/30 px-6 py-3 text-xs text-text-muted sm:px-8"
					>
						<span class="text-scitech-mint inline-flex items-center gap-1.5 font-medium">
							<FileText class="h-4 w-4" />
							Informasi Resmi Rekrutmen
						</span>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<!-- EMPTY STATE -->
		<EmptyData
			title="Informasi Rekrutmen Belum Tersedia"
			description="Saat ini belum ada pembukaan rekrutmen atau pengumuman ketentuan baru."
		/>
	{/if}
</div>

<!-- MODAL PREVIEW POSTER -->
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

		<div
			class="bg-scitech-slate relative z-10 flex max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-2xl border border-border-color shadow-2xl"
		>
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

			<!-- Gambar Poster -->
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

<style>
	/* Styling typography untuk merender elemen Rich Text HTML */
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
