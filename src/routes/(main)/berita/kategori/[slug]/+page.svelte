<script lang="ts">
	import {
		Calendar,
		Folder,
		ArrowRight,
		Newspaper,
		Loader2,
		ArrowLeft
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import BtnFloatPagination from '$lib/components/admin/btnFloatPagination.svelte';
	import { classTopSpace } from '$lib/constants';

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

<div class={ `${classTopSpace} mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6`}>
	<div class="mb-8 border-b border-border-color/10 pb-6">
		<a
			href="/berita"
			class="bg-bg-secondary hover:bg-bg-secondary-hover text-text-muted hover:text-text-main border-border-color mb-6 border inline-flex items-center gap-2 px-4 py-2 text-xs font-bold transition-colors"
		>
			<ArrowLeft class="h-4 w-4" />
			<span>Semua Berita</span>
		</a>

		{#await data.category}
			<div class="flex items-center gap-3 pt-2">
				<div class="h-12 w-12 animate-pulse bg-white/10"></div>
				<div class="space-y-2">
					<div class="h-4 w-28 animate-pulse bg-white/5"></div>
					<div class="h-8 w-48 animate-pulse bg-white/10"></div>
				</div>
			</div>
		{:then category}
			<div class="flex items-center gap-3 pt-2">
				<div class="bg-scitech-mint/10 text-scitech-mint border border-scitech-mint/30 p-3">
					<Folder class="h-6 w-6" />
				</div>
				<div>
					<span class="font-mono text-[11px] uppercase tracking-wider text-scitech-mint">
						Kategori Berita
					</span>
					<h1 class="text-text-main text-2xl font-extrabold tracking-tight sm:text-3xl">
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
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each Array(4) as _}
				<div class="bg-scitech-slate/40 border-border-color/10 flex flex-col border p-6">
					<div class="mb-4 h-48 w-full animate-pulse bg-white/5"></div>
					<div class="mb-2 h-4 w-1/3 animate-pulse bg-white/10"></div>
					<div class="mb-3 h-6 w-3/4 animate-pulse bg-white/10"></div>
					<div class="h-16 w-full animate-pulse bg-white/5"></div>
				</div>
			{/each}
		</div>
	{:then newsList}
		{#if newsList.length === 0}
			<div class="bg-bg-secondary border-border-color border p-12 text-center">
				<Newspaper class="text-text-muted/50 mx-auto mb-3 h-12 w-12" />
				<p class="font-mono text-sm text-text-muted">
					Belum ada berita yang diterbitkan pada kategori ini.
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each newsList as item (item.id)}
					<article
						class="bg-scitech-slate/70 hover:border-scitech-mint/50 border-border-color/10 group flex flex-col justify-between border transition-colors"
					>
						<div>
							{#if item.image_url}
								<div class="border-border-color/10 relative h-48 w-full overflow-hidden border-b bg-black/40">
									<img
										src={item.image_url}
										alt={item.title}
										class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
							{:else}
								<div
									class="bg-scitech-navy/60 border-border-color/10 text-text-muted flex h-36 w-full items-center justify-center border-b"
								>
									<Newspaper class="h-10 w-10 opacity-30" />
								</div>
							{/if}

							<div class="space-y-3 p-6">
								<div class="flex flex-wrap items-center gap-3 text-xs text-text-muted">
									{#if item.category_name}
										<span
											class="bg-scitech-mint/10 text-scitech-mint border-scitech-mint/30 border inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
										>
											<Folder class="h-3 w-3" />
											{item.category_name}
										</span>
									{/if}

									<span class="font-mono inline-flex items-center gap-1">
										<Calendar class="text-text-muted h-3.5 w-3.5" />
										{formatDate(item.published_at)}
									</span>
								</div>

								<!-- Judul Berita -->
								<h2
									class="group-hover:text-scitech-mint text-text-main line-clamp-2 text-lg font-bold transition-colors"
								>
									{item.title}
								</h2>

								<p class="text-text-muted line-clamp-3 text-xs leading-relaxed sm:text-sm">
									{item.content.replace(/<[^>]*>?/gm, '')}
								</p>
							</div>
						</div>

						<div class="border-border-color/10 border-t p-6 pt-4">
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
		<div class="border-red-500/40 bg-red-500/10 border p-6 text-center text-red-400">
			<p class="text-sm font-semibold">Gagal memuat berita: {error.message}</p>
		</div>
	{/await}
</div>

<!-- floating navigation (pagination mengambang) -->
{#await data.pagination}
	<div
		class="bg-scitech-navy/90 border-border-color/20 fixed bottom-6 left-1/2 z-40 -translate-x-1/2 border px-6 py-3 backdrop-blur-md"
	>
		<div class="flex items-center gap-3 text-xs text-text-muted">
			<Loader2 class="text-scitech-mint h-4 w-4 animate-spin" />
			<span>Memuat navigasi...</span>
		</div>
	</div>
{:then pagination}
	
  <BtnFloatPagination {pagination} onPageChange={goToPage} />

  {/await}
