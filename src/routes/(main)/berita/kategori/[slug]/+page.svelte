<script lang="ts">
	import { Calendar, Folder, ArrowRight, Newspaper, Loader2, ArrowLeft } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import BtnFloatPagination from '$lib/components/admin/btnFloatPagination.svelte';
	import { classTopSpace } from '$lib/constants';
	import SpinLoading from '$lib/components/loading/spin.svelte';
	import EmptyData from '../../../_components/emptyData.svelte';

	let { data }: { data: PageData } = $props();

	// Fungsi navigasi pagination via URL SearchParams
	function goToPage(newPage: number) {
		const searchParams = new URLSearchParams(page.url.search);
		searchParams.set('page', newPage.toString());
		goto(`?${searchParams.toString()}`);
	}

	// Helper format tanggal
	function formatDate(dateString: Date | string) {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<div class={`${classTopSpace} mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6`}>
	<div class="mb-8 border-border-color/10 pb-6">
		<a
			href="/berita"
			class="mb-6 inline-flex items-center gap-2 border border-border-color bg-bg-secondary px-4 py-2 text-xs font-bold text-text-muted transition-colors hover:bg-bg-secondary-hover hover:text-text-main"
		>
			<ArrowLeft class="h-4 w-4" />
			<span>Semua Berita</span>
		</a>

		{#await data.category}
			<!-- <div class="flex items-center gap-3 pt-2"> -->
			<!-- 	<div class="h-12 w-12 animate-pulse bg-white/10"></div> -->
			<!-- 	<div class="space-y-2"> -->
			<!-- 		<div class="h-4 w-28 animate-pulse bg-white/5"></div> -->
			<!-- 		<div class="h-8 w-48 animate-pulse bg-white/10"></div> -->
			<!-- 	</div> -->
			<!-- </div> -->
			<SpinLoading />
		{:then category}
			<div class="flex items-center gap-3 pt-2">
				<div class="text-scitech-mint border-scitech-mint/30 border bg-bg-secondary/10 p-3">
					<Folder class="h-6 w-6" />
				</div>
				<div>
					<span class="text-scitech-mint font-mono text-[11px] tracking-wider uppercase">
						Kategori Berita
					</span>
					<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
						{category.name}
					</h1>
				</div>
			</div>
		{:catch error}
			<p class="text-xs text-red-400">Gagal memuat kategori: {error.message}</p>
		{/await}
	</div>

	<!-- container grid berita (data streaming dengan {#await}) -->
	{#await data.newsList}
		<SpinLoading />
	{:then newsList}
		{#if newsList.length === 0}
			<EmptyData title="Belum ada Berita yang di terbitka" icon={'Newspaper'} />
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each newsList as item (item.id)}
					<article
						class="hover:border-scitech-mint/50 group flex flex-col justify-between border border-border-color/10 bg-bg-secondary/70 transition-colors"
					>
						<div>
							{#if item.image_url}
								<div
									class="relative h-48 w-full overflow-hidden border-b border-border-color/10 bg-black/40"
								>
									<img
										src={item.image_url}
										alt={item.title}
										class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
							{:else}
								<div
									class="bg-scitech-navy/60 flex h-36 w-full items-center justify-center border-b border-border-color/10 text-text-muted"
								>
									<Newspaper class="h-10 w-10 opacity-30" />
								</div>
							{/if}

							<div class="space-y-3 p-6">
								<div class="flex flex-wrap items-center gap-3 text-xs text-text-muted">
									{#if item.category_name}
										<span
											class="text-scitech-mint border-scitech-mint/30 inline-flex items-center gap-1.5 border bg-bg-primary/10 px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase"
										>
											<Folder class="h-3 w-3" />
											{item.category_name}
										</span>
									{/if}

									<span class="inline-flex items-center gap-1 font-mono">
										<Calendar class="h-3.5 w-3.5 text-text-muted" />
										{formatDate(item.published_at)}
									</span>
								</div>

								<!-- Judul Berita -->
								<h2
									class="group-hover:text-scitech-mint line-clamp-2 text-lg font-bold text-text-main transition-colors"
								>
									{item.title}
								</h2>

								<p class="line-clamp-3 text-xs leading-relaxed text-text-muted sm:text-sm">
									{item.content.replace(/<[^>]*>?/gm, '')}
								</p>
							</div>
						</div>

						<div class="border-t border-border-color/10 p-6 pt-4">
							<a
								href="/berita/{item.id}"
								class="text-scitech-cyan hover:text-scitech-mint inline-flex items-center gap-2 text-xs font-bold transition-all"
							>
								<span>Baca Selengkapnya</span>
								<ArrowRight class="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
							</a>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	{:catch error}
		<div class="border border-red-500/40 bg-red-500/10 p-6 text-center text-red-400">
			<p class="text-sm font-semibold">Gagal memuat berita: {error.message}</p>
		</div>
	{/await}
</div>

<!-- floating navigation (pagination mengambang) -->
{#await data.pagination}
	<div
		class="bg-scitech-navy/90 fixed bottom-6 left-1/2 z-40 -translate-x-1/2 border border-border-color/20 px-6 py-3 backdrop-blur-md"
	>
		<div class="flex items-center gap-3 text-xs text-text-muted">
			<Loader2 class="text-scitech-mint h-4 w-4 animate-spin" />
			<span>Memuat navigasi...</span>
		</div>
	</div>
{:then pagination}
	<BtnFloatPagination {pagination} onPageChange={goToPage} />
{/await}
