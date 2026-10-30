<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import { Maximize2, XIcon } from 'lucide-svelte';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// State untuk Modal Preview Sampul Buku / Pedoman
	let selectedImage = $state<{ url: string; title: string } | null>(null);

	function openModal(url: string, title: string) {
		selectedImage = { url, title };
	}

	function closeModal() {
		selectedImage = null;
	}
</script>

<div class={`relative container mx-auto px-4 ${classTopSpace}`}>
	<header class="mb-8 text-center sm:text-left">
		<h1 class="text-2xl font-bold tracking-tight text-text-main sm:text-3xl">
			Daftar Penerima Beasiswa
		</h1>
		<p class="mt-2 text-sm text-text-main/70">
			Mahasiswa Program Studi Teknologi Informasi penerima program beasiswa.
		</p>
	</header>

	{#if data.scholarships.length === 0}
		<EmptyData
			title="Belum ada Data Beasiswa"
			description="Data penerima beasiswa belum dimasukkan atau belum tersedia saat ini."
		/>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.scholarships as item (item.id)}
				<article
					class="group flex flex-col overflow-hidden rounded-2xl border border-border-color/10 bg-bg-secondary p-4 shadow-lg transition-all duration-300 hover:border-border-color/30 hover:shadow-xl"
				>
					<div class="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-bg-primary/50">
						<img
							src={item.image_url || '/placeholder-student.png'}
							alt={item.student_name}
							class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
							loading="lazy"
						/>
						<div
							class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<button
								onclick={() => openModal(item.image_url!, item.student_name)}
								class="inline-flex items-center gap-2 rounded-xl bg-bg-primary px-4 py-2 text-xs font-bold text-text-main shadow-xl transition-transform hover:scale-105 active:scale-95"
							>
								<Maximize2 class="h-4 w-4" />
								<span>Lihat Sampul</span>
							</button>
						</div>
					</div>

					<div class="mt-4 flex flex-1 flex-col justify-between">
						<div>
							<span
								class="border-scitech-mint/20 bg-bg-secondary-dim text-scitech-mint inline-block rounded-full border px-2.5 py-1 text-[10px] font-semibold"
							>
								Penerima Beasiswa
							</span>

							<!-- Nama Mahasiswa -->
							<h3
								class="group-hover:text-scitech-mint mt-2 text-base font-bold tracking-wide text-text-main transition-colors"
							>
								{item.student_name}
							</h3>

							<!-- Program Beasiswa -->
							<p class="mt-1 text-xs font-medium text-text-main/60">
								{item.scholarship_name}
							</p>
						</div>
					</div>
				</article>
			{/each}
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

		<div
			class="relative z-10 flex max-h-[90vh] max-w-3xl flex-col overflow-hidden rounded-2xl border border-border-color bg-bg-secondary shadow-2xl"
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
					<XIcon class="h-5 w-5" />
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
