<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import { formatDate } from '$lib/utils';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import { Award, Calendar, Maximize2, X, AlertCircle } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// State Modal Preview Sertifikat
	let selectedImage = $state<{ url: string; title: string } | null>(null);

	function openModal(url: string, title: string) {
		selectedImage = { url, title };
	}

	function closeModal() {
		selectedImage = null;
	}

</script>

<div class={` ${classTopSpace} mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8`}>
	<div class="mb-10 pb-6 text-center sm:text-left">
		<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
			Akreditasi Program Studi
		</h1>
		<p class="mt-2 text-sm text-text-muted">
			Informasi status, peringkat akreditasi, dan sertifikat resmi dari lembaga akreditasi nasional.
		</p>
	</div>

	{#if data?.accreditation}
		<article
			class="overflow-hidden rounded-3xl border border-border-color/10 bg-bg-secondary p-6 shadow-xl backdrop-blur-md transition-all duration-300 sm:p-8"
		>
			<div class="mb-6 flex items-center justify-between border-b border-border-color/10 pb-4">
				<div class="flex items-center gap-2 text-xs font-semibold text-text-main/60">
					<div
						class="border-scitech-mint/20 bg-scitech-mint/10 text-scitech-mint flex h-6 w-6 items-center justify-center rounded-lg border"
					>
						<Calendar class="h-3.5 w-3.5" />
					</div>
					<span>Diperbarui: {formatDate(data.accreditation.updated_at) } </span>
				</div>
			</div>

			<!-- Konten Utama: Deskripsi di Atas, Gambar di Bawah -->
			<div class="space-y-8">
				<div class="prose max-w-none text-sm leading-relaxed text-text-main prose-invert">
					{@html data?.accreditation.description}
				</div>

				{#if data.accreditation.image_url}
					<div class="w-full">
						<div
							class="group relative overflow-hidden rounded-2xl border border-border-color/15 bg-bg-primary shadow-lg"
						>
							<img
								src={data.accreditation.image_url}
								alt="Sertifikat Akreditasi"
								class="h-auto max-h-125 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div
								class="absolute inset-0 flex items-center justify-center bg-bg-primary/70 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100"
							>
								<button
									type="button"
									onclick={() =>
										openModal(data?.accreditation?.image_url!, 'Sertifikat Akreditasi')}
									class="bg-scitech-mint inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-bg-primary shadow-xl transition-transform hover:scale-105 active:scale-95"
								>
									<Maximize2 class="h-4 w-4" />
									<span>Lihat Sertifikat Penuh</span>
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</article>
	{:else}
		<!-- EMPTY STATE -->
		<EmptyData
			title="Informasi Akreditasi Belum Tersedia"
			description="	Data akreditasi belum dipublikasikan. Silakan cek kembali secara berkala.
"
		/>
	{/if}
</div>

<!-- modal preview lightbox gambar -->
{#if selectedImage}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<!-- Overlay Background to Close -->
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
				<h3 class="text-sm font-bold text-text-main sm:text-base">{selectedImage.title}</h3>
				<button
					onclick={closeModal}
					class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-main"
					aria-label="Tutup"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

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
	:global(.prose h1),
	:global(.prose h2),
	:global(.prose h3) {
		color: #ffffff;
		font-weight: 700;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
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
</style>
