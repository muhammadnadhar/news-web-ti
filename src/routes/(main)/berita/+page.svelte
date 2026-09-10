<script lang="ts">
	import type { PageData } from './$types';
	import { User, Calendar, ArrowRight } from 'lucide-svelte';
import SidebarWidgetPriview from '$lib/components/admin/sidebarWidgetPriview.svelte';
	let data: PageData = $props();

	// Tracker status loading gambar untuk skeleton effect
	let loadedImages: Record<string, boolean> = {};

	function handleImageLoad(id: string) {
		loadedImages[id] = true;
	}
</script>

<div class="min-h-screen bg-bg-primary py-10 text-text-main transition-colors">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
			<main class="space-y-8 lg:col-span-8">
				{#each data.newsList as news (news.id)}
					<article
						class="overflow-hidden rounded-xl border border-color-border-light bg-color-bg-secondary shadow-sm transition-shadow hover:shadow-md"
					>
						<!-- Wrapper Image dengan Skeleton Loading -->
						<div
							class="relative h-80 w-full overflow-hidden bg-[var(--color-bg-primary-glare)] sm:h-96"
						>
							{#if !loadedImages[news.id]}
								<div
									class="absolute inset-0 animate-pulse bg-gradient-to-r from-[var(--color-bg-primary-glare)] via-[var(--color-bg-secondary-hover)] to-[var(--color-bg-primary-glare)]"
								></div>
							{/if}

							<img
								src={news.image_url || '/placeholder-news.jpg'}
								alt={news.title}
								on:load={() => handleImageLoad(news.id)}
								class="h-full w-full object-cover transition-opacity duration-300 {loadedImages[
									news.id
								]
									? 'opacity-100'
									: 'opacity-0'}"
							/>
						</div>

						<!-- Content Card Berita -->
						<div class="space-y-4 p-6 sm:p-8">
							<!-- Meta Info (Penulis & Tanggal) -->
							<div
								class="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--color-text-muted)]"
							>
								<div class="flex items-center gap-1.5">
									<User class="h-4 w-4 text-[var(--color-accent-primary)]" />
									<span>M. Fadhlan</span>
								</div>
								<div class="flex items-center gap-1.5">
									<Calendar class="h-4 w-4 text-[var(--color-accent-primary)]" />
									<span>
										{new Date(news.published_at).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'long',
											year: 'numeric'
										})}
									</span>
								</div>
							</div>

							<!-- Judul Berita -->
							<h2
								class="line-clamp-2 text-xl font-bold text-text-main transition-colors hover:text-[var(--color-accent-purple)] sm:text-2xl"
							>
								<a href={`/news/${news.id}`}>
									{news.title}
								</a>
							</h2>

							<!-- Ringkasan Teks Berita -->
							<p
								class="line-clamp-3 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base"
							>
								{news.content ||
									'Prodi Teknologi Informasi Fakultas Sains dan Teknologi kembali menyelenggarakan kegiatan akademik dan kemahasiswaan...'}
							</p>

							<!-- Tombol Read More -->
							<div class="flex justify-end pt-2">
								<a
									href={`/news/${news.id}`}
									class="inline-flex items-center gap-2 rounded-lg bg-[var(--color-bg-secondary-hover)] px-5 py-2.5 text-xs font-semibold text-[var(--color-text-main)] shadow-sm transition-all hover:bg-[var(--color-accent-purple)] hover:text-white"
								>
									<span>Read More</span>
									<ArrowRight class="h-3.5 w-3.5" />
								</a>
							</div>
						</div>
					</article>
				{/each}
			</main>

			<!-- Sidebar Component -->
			<SidebarWidgetPriview
				recentPosts={data.recentNews}
				categories={data.categories}
			/>
		</div>
	</div>
</div>
