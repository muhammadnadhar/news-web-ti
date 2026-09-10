<script lang="ts">
	import type { SidebarCategoryItem, SidebarRecentItem } from "$lib/types/admin/sibebarWidgetPriview";

	// Props menggunakan Svelte 5 $props() runic
	let {
		recentTitle = 'Berita Terbaru',
		recentItems = [],
		categoryTitle = 'Kategori Berita',
		categoryItems = [],
		onRecentClick,
		onCategoryClick
	}: {
		recentTitle?: string;
		recentItems?: SidebarRecentItem[];
		categoryTitle?: string;
		categoryItems?: SidebarCategoryItem[];
		onRecentClick?: (item: SidebarRecentItem) => void;
		onCategoryClick?: (item: SidebarCategoryItem) => void;
	} = $props();
</script>

<aside
	class="bg-scitech-slate/60 w-full space-y-8 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-7"
>
	<!-- Bagian 1: Recent Items / Feed Terbaru dengan Preview Gambar -->
	{#if recentItems && recentItems.length > 0}
		<div class="space-y-5">
			<h3 class="text-scitech-mint text-lg font-bold tracking-wide">
				{recentTitle}
			</h3>

			<div class="space-y-4">
				{#each recentItems as item (item.id)}
					<a
						href={item.href || '#'}
						onclick={(e) => {
							if (onRecentClick) {
								e.preventDefault();
								onRecentClick(item);
							}
						}}
						class="group flex items-start gap-3.5 transition-all hover:opacity-90"
					>
						<!-- Thumbnail Gambar -->
						<div
							class="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30"
						>
							<img
								src={item.imageUrl}
								alt={item.title}
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								loading="lazy"
							/>
						</div>

						<!-- Detail Teks -->
						<div class="flex-1 space-y-1">
							<h4
								class="line-clamp-3 text-xs font-bold leading-snug text-white transition-colors group-hover:text-scitech-mint"
							>
								{item.title}
							</h4>
							{#if item.date}
								<p class="text-[10px] font-medium italic text-white/50">
									{item.date}
								</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Separator Line (jika kedua bagian ada) -->
	{#if recentItems.length > 0 && categoryItems.length > 0}
		<hr class="border-white/10" />
	{/if}

	<!-- Bagian 2: Kategori & Total Data Counter -->
	{#if categoryItems && categoryItems.length > 0}
		<div class="space-y-4">
			<h3 class="text-scitech-mint text-lg font-bold tracking-wide">
				{categoryTitle}
			</h3>

			<ul class="space-y-2 text-xs font-medium text-white/80">
				{#each categoryItems as cat (cat.id)}
					<li class="space-y-1.5">
						<!-- Main Category -->
						<a
							href={cat.href || '#'}
							onclick={(e) => {
								if (onCategoryClick) {
									e.preventDefault();
									onCategoryClick(cat);
								}
							}}
							class="flex items-center justify-between py-0.5 transition-colors hover:text-scitech-mint"
						>
							<span>{cat.name}</span>
							<span class="text-white/40">({cat.count})</span>
						</a>

						<!-- Nested Sub-Categories (jika ada) -->
						{#if cat.children && cat.children.length > 0}
							<ul class="ml-4 space-y-1.5 border-l border-white/10 pl-3 text-white/60">
								{#each cat.children as sub (sub.id)}
									<li>
										<a
											href={sub.href || '#'}
											onclick={(e) => {
												if (onCategoryClick) {
													e.preventDefault();
													onCategoryClick(sub);
												}
											}}
											class="flex items-center justify-between py-0.5 transition-colors hover:text-scitech-mint"
										>
											<span>{sub.name}</span>
											<span class="text-white/40">({sub.count})</span>
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</aside>
