<script lang="ts">
	import type { NewsItemDTO } from '$lib/dto/admin/article/berita';
	import type { NewsCategoryDTO } from '$lib/dto/admin/dataset';
	import { Newspaper, X, Layers, Calendar, ChevronRight } from 'lucide-svelte';

	interface Props {
		recentNews?: NewsItemDTO[];
		categories?: NewsCategoryDTO[];
	}

	let { recentNews = [], categories = [] }: Props = $props();

  $inspect("data yg di tampilan  : ",recentNews,categories)

	// State visibilitas drawer
	let isOpen = $state(false);

	function toggleDrawer() {
		isOpen = !isOpen;
	}

	function closeDrawer() {
		isOpen = false;
	}

	// Helper format tanggal singkat
	function formatDate(dateInput: Date | string): string {
		if (!dateInput) return '';
		const d = new Date(dateInput);
		return d.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<!-- 1. FLOATING TRIGGER BUTTONS                -->
<!-- Desktop Button: Menyatu di Sisi Kanan Tengah -->
<button
	type="button"
	onclick={toggleDrawer}
	aria-label="Buka Berita & Kategori"
	class="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 items-center gap-2 rounded-l-2xl border border-r-0 border-border-light bg-bg-secondary px-2.5 py-4 text-text-main shadow-2xl transition-all duration-200 hover:bg-bg-secondary-hover hover:text-accent-primary md:flex md:flex-col"
>
	<Newspaper class="h-5 w-5 text-accent-primary" />
	<span class="font-mono text-xs font-bold tracking-wider uppercase [writing-mode:vertical-lr]">
		Berita & Kategori
	</span>
	<!-- Indicator Badge -->
	{#if recentNews.length > 0}
		<span
			class="flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary-dim text-[10px] font-bold text-accent-primary"
		>
			{recentNews.length}
		</span>
	{/if}
</button>

<!-- Mobile Button: Menyatu di Batas Bawah Tengah -->
<button
	type="button"
	onclick={toggleDrawer}
	aria-label="Buka Berita & Kategori"
	class="fixed bottom-0 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-t-2xl border border-b-0 border-border-light bg-bg-secondary/95 px-5 py-2 text-text-main shadow-2xl backdrop-blur-md transition-transform duration-200 active:scale-95 md:hidden"
>
	<Newspaper class="h-4 w-4 text-accent-primary" />
	<span class="text-xs font-semibold">Berita & Kategori</span>
	<span
		class="flex h-4 w-4 items-center justify-center rounded-full bg-accent-primary-dim text-[9px] font-bold text-accent-primary"
	>
		{recentNews.length}
	</span>
</button>

<!-- ========================================== -->
<!-- 2. BACKDROP OVERLAY                        -->
<!-- ========================================== -->
{#if isOpen}
	<button
		type="button"
		tabindex="-1"
		onclick={closeDrawer}
		aria-label="Tutup Overlay"
		class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
	></button>
{/if}

<!-- ========================================== -->
<!-- 3. DRAWER / BOTTOM SHEET PANEL             -->
<!-- ========================================== -->
<aside
	class="/* Style Desktop: Right Drawer (Slide dari Kanan) */ fixed
	z-50 flex flex-col border-border-light bg-bg-secondary shadow-2xl transition-transform duration-300 ease-in-out
	md:top-0 md:right-0 md:left-auto md:h-full md:w-96 md:rounded-l-2xl md:border-t-0 md:border-l
	{isOpen ? 'md:translate-x-0' : 'md:translate-x-full'}
	/* Style Mobile: Bottom Sheet (Slide dari Bawah) */
	bottom-0 left-0 h-[65vh] w-full rounded-t-2xl border-t
	{isOpen ? 'translate-y-0' : 'translate-y-full'}"
>
	<!-- Handle indikator tarik untuk Mobile -->
	<div class="flex justify-center pt-2 md:hidden">
		<div class="h-1.5 w-12 rounded-full bg-border-light"></div>
	</div>

	<!-- Header Panel -->
	<div class="flex items-center justify-between border-b border-border-light p-4">
		<div class="flex items-center gap-2">
			<Newspaper class="h-5 w-5 text-accent-primary" />
			<h2 class="text-base font-bold text-text-main">Info & Kategori</h2>
		</div>
		<button
			type="button"
			onclick={closeDrawer}
			class="rounded-lg p-1 text-text-muted hover:bg-bg-primary hover:text-text-main"
			aria-label="Tutup Panel"
		>
			<X class="h-5 w-5" />
		</button>
	</div>

	<!-- Konten Scrollable -->
	<div class="flex-1 space-y-6 overflow-y-auto p-4">
		<!-- KATEGORI BERITA (Pills / Badges) -->
		{#if categories.length > 0}
			<div>
				<div class="mb-3 flex items-center gap-1.5 text-xs font-semibold text-text-muted">
					<Layers class="h-3.5 w-3.5" />
					<span>Kategori Berita</span>
				</div>
				<div class="flex flex-wrap gap-1.5">
					{#each categories as cat (cat.id)}
						<a
							href="/berita/kategori/{cat.slug || cat.id}"
							onclick={closeDrawer}
							class="border border-border-light bg-bg-primary px-2.5 py-1 text-xs font-medium text-text-main transition-colors hover:border-accent-primary hover:text-accent-primary"
						>
							{cat.name}
						</a>
					{/each}
				</div>
			</div>
		{/if}

		<!-- 5 berita terbaru -->
		<div>
			<div class="mb-3 flex items-center justify-between">
				<span class="text-xs font-semibold text-text-muted">5 Berita Terkini</span>
				<a
					href="/berita"
					onclick={closeDrawer}
					class="flex items-center gap-0.5 text-xs font-medium text-accent-primary hover:underline"
				>
					Lihat Semua
					<ChevronRight class="h-3 w-3" />
				</a>
			</div>

			<div class="space-y-3">
				{#each recentNews as news (news.id)}
					<a
						href="/berita/{news.id}"
						onclick={closeDrawer}
						class="group flex gap-3 border border-border-light bg-bg-primary p-2.5 transition-all hover:border-accent-primary/50"
					>
						<div
							class="h-16 w-16 shrink-0 overflow-hidden border border-border-light bg-bg-secondary"
						>
							{#if news.image_url}
								<img
									src={news.image_url}
									alt={news.title}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center text-text-muted">
									<Newspaper class="h-6 w-6 opacity-30" />
								</div>
							{/if}
						</div>

						<!-- Detail Berita -->
						<div class="flex min-w-0 flex-1 flex-col justify-between">
							<h3
								class="line-clamp-2 text-xs font-bold text-text-main group-hover:text-accent-primary"
							>
								{news.title}
							</h3>

							<div class="flex items-center justify-between pt-1 text-[10px] text-text-muted">
								{#if news.category_name}
									<span class="font-medium text-accent-primary">{news.category_name}</span>
								{/if}
								<div class="ml-auto flex items-center gap-1">
									<Calendar class="h-3 w-3" />
									<span>{formatDate(news.published_at)}</span>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>

	<!-- Footer Drawer -->
	<div class="border-t border-border-light bg-bg-primary/50 p-3 text-center">
		<a
			href="/berita"
			onclick={closeDrawer}
			class="inline-block w-full border border-border-light bg-bg-secondary py-2 text-xs font-bold text-text-main hover:bg-bg-secondary-hover"
		>
			Jelajahi Seluruh Berita
		</a>
	</div>
</aside>
