<script lang="ts">
	import type { NewsItemDTO } from '$lib/types/admin/article/berita';
	import { Calendar, ArrowRight, Sparkles, NewspaperIcon, AlertCircle } from 'lucide-svelte';

	interface Props {
		recentNews: Promise<NewsItemDTO[]>;
	}

	let { recentNews }: Props = $props();

	let scrollContainer = $state<HTMLDivElement | null>(null);
	let activeIndex = $state(0);

	// State untuk kontrol Drag Mouse Desktop
	let isDown = $state(false);
	let startX = $state(0);
	let scrollLeftPos = $state(0);

	function handleScroll() {
		if (!scrollContainer) return;

		const containerCenter = scrollContainer.scrollLeft + scrollContainer.clientWidth / 2;
		const cards = Array.from(scrollContainer.children) as HTMLElement[];

		let closestIndex = 0;
		let minDistance = Infinity;

		cards.forEach((card, index) => {
			const cardCenter = card.offsetLeft + card.offsetWidth / 2;
			const distance = Math.abs(containerCenter - cardCenter);

			if (distance < minDistance) {
				minDistance = distance;
				closestIndex = index;
			}
		});

		activeIndex = closestIndex;
	}

	// Fitur Scroll dengan Roda Mouse Vertikal -> Horizontal
	function handleWheel(e: WheelEvent) {
		if (!scrollContainer) return;
		if (e.deltaY !== 0) {
			scrollContainer.scrollLeft += e.deltaY * 1.2;
		}
	}

	// Fitur Click & Drag (Desktop Mouse)
	function handleMouseDown(e: MouseEvent) {
		if (!scrollContainer) return;
		isDown = true;
		startX = e.pageX - scrollContainer.offsetLeft;
		scrollLeftPos = scrollContainer.scrollLeft;
	}

	function handleMouseLeave() {
		isDown = false;
	}

	function handleMouseUp() {
		isDown = false;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDown || !scrollContainer) return;
		e.preventDefault();
		const x = e.pageX - scrollContainer.offsetLeft;
		const walk = (x - startX) * 1.5;
		scrollContainer.scrollLeft = scrollLeftPos - walk;
	}

	function scrollToCard(index: number) {
		if (!scrollContainer) return;
		const cards = Array.from(scrollContainer.children) as HTMLElement[];
		if (cards[index]) {
			cards[index].scrollIntoView({
				behavior: 'smooth',
				inline: 'center',
				block: 'nearest'
			});
		}
	}

	// Helper Format Tanggal
	function formatDate(dateInput: Date | string): string {
		if (!dateInput) return '-';
		const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
		if (isNaN(date.getTime())) return '-';
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(date);
	}

	// Helper Pembersih HTML tag dari konten artikel
	function stripHtml(html: string): string {
		if (!html) return '';
		return html.replace(/<[^>]*>?/gm, '');
	}
</script>

<section class="relative w-full overflow-hidden py-12 md:py-24">
	<!-- Header Section -->
	<div class="mx-auto mb-10 max-w-xl px-6 text-center">
		<!-- <span -->
		<!-- 	class="text-scitech-mint mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase" -->
		<!-- > -->
		<!-- 	<Sparkles class="text-scitech-mint h-4 w-4" /> Information Hub -->
		<!-- </span> -->
		<h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">Berita Terbaru</h2>
	</div>

	{#await recentNews}
		<!-- Loading Skeleton State -->
		<div
			class="flex scrollbar-none gap-6 overflow-x-auto px-[calc(50%-150px)] py-12 sm:px-[calc(50%-180px)]"
		>
			{#each Array(3) as _}
				<div
					class="bg-scitech-slate/40 flex w-[300px] flex-none animate-pulse flex-col justify-between overflow-hidden rounded-2xl border border-border-color sm:w-90"
				>
					<div>
						<div class="h-44 w-full bg-white/10 sm:h-48"></div>
						<div class="space-y-3 p-5">
							<div class="h-3 w-24 rounded-md bg-white/10"></div>
							<div class="h-5 w-full rounded-md bg-white/10"></div>
							<div class="h-4 w-4/5 rounded-md bg-white/10"></div>
						</div>
					</div>
					<div class="p-5 pt-0">
						<div class="h-4 w-28 rounded-md bg-white/10"></div>
					</div>
				</div>
			{/each}
		</div>
	{:then newsList}
		{#if newsList && newsList.length > 0}
			<!-- Container Carousel Berita -->
			<div
				bind:this={scrollContainer}
				onscroll={handleScroll}
				onwheel={handleWheel}
				onmousedown={handleMouseDown}
				onmouseleave={handleMouseLeave}
				onmouseup={handleMouseUp}
				onmousemove={handleMouseMove}
				role="region"
				aria-label="Carousel Berita"
				class="flex cursor-grab touch-pan-x snap-x snap-mandatory scrollbar-none gap-4 overflow-x-auto
                       px-[calc(50%-150px)] py-12 select-none active:cursor-grabbing sm:gap-8 sm:px-[calc(50%-180px)]"
			>
				{#each newsList as news, index (news.id)}
					{@const isActive = activeIndex === index}

					<article
						class="bg-scitech-slate/80 flex w-[300px] flex-none snap-center flex-col justify-between overflow-hidden rounded-2xl
                               border backdrop-blur-md transition-all duration-500 ease-out sm:w-90
                               {isActive
							? 'border-scitech-mint/60 shadow-scitech-mint/10 z-20 scale-105 opacity-100 shadow-2xl'
							: 'z-10 scale-95 border-border-color opacity-50 blur-[0.2px]'}"
					>
						<div>
							<!-- Gambar Berita & Badge Kategori -->
							<div class="bg-scitech-navy relative h-44 w-full overflow-hidden sm:h-48">
								{#if news.image_url}
									<img
										src={news.image_url}
										alt={news.title}
										class="pointer-events-none h-full w-full object-cover transition-transform duration-700 {isActive
											? 'scale-105'
											: 'scale-100'}"
										draggable="false"
										loading="lazy"
									/>
								{:else}
									<div
										class="flex h-full w-full items-center justify-center bg-slate-800 text-slate-500"
									>
										<NewspaperIcon class="h-12 w-12 opacity-40" />
									</div>
								{/if}

								<span
									class="bg-scitech-navy/80 text-scitech-mint border-scitech-mint/30 absolute top-3 left-3 rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-md backdrop-blur-md"
								>
									{news.category}
								</span>
							</div>

							<!-- Detail Konten -->
							<div class="p-5">
								<div class="mb-2 flex items-center gap-1.5 text-xs text-text-muted">
									<Calendar class="text-scitech-cyan h-3.5 w-3.5" />
									<span>{formatDate(news.published_at)}</span>
								</div>

								<h3
									class="mb-2 line-clamp-2 text-sm leading-snug font-bold text-text-main sm:text-base {isActive
										? 'text-text-main'
										: 'text-text-main/80'}"
								>
									{news.title}
								</h3>

								<p class="line-clamp-2 text-xs leading-relaxed text-text-muted">
									{stripHtml(news.content)}
								</p>
							</div>
						</div>

						<!-- Link Selengkapnya -->
						<div class="px-5 pt-1 pb-5">
							<a
								href="/berita/{news.id}"
								class="text-scitech-mint hover:text-scitech-mint-hover group inline-flex items-center gap-2 text-xs font-bold transition-all"
							>
								<span>Baca Selengkapnya</span>
								<ArrowRight
									class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
								/>
							</a>
						</div>
					</article>
				{/each}
			</div>

			<!-- Dot Indicators -->
			<div class="mt-4 flex items-center justify-center gap-2">
				{#each newsList as _, index}
					<button
						onclick={() => scrollToCard(index)}
						aria-label="Ke slide {index + 1}"
						class="h-2 rounded-full transition-all duration-300 {activeIndex === index
							? 'bg-scitech-mint w-8'
							: 'w-2 bg-white/20 hover:bg-white/40'}"
					></button>
				{/each}
			</div>
		{:else}
			<!-- Tampilan Data Kosong (Empty State) -->
			<div
				class="bg-scitech-slate/40 mx-auto max-w-lg rounded-2xl border border-border-color p-8 text-center backdrop-blur-md"
			>
				<div
					class="bg-scitech-mint/10 text-scitech-mint mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
				>
					<NewspaperIcon class="h-7 w-7" />
				</div>
				<h3 class="mb-2 text-lg font-bold text-text-main">Belum Ada Berita Terbaru</h3>
				<p class="text-xs leading-relaxed text-text-muted">
					Saat ini belum terdapat berita atau pengumuman yang dipublikasikan. Silakan periksa
					kembali secara berkala.
				</p>
			</div>
		{/if}
	{:catch error}
		<!-- Error State -->
		<div
			class="mx-auto max-w-lg rounded-2xl border border-red-500/20 bg-red-950/20 p-8 text-center backdrop-blur-md"
		>
			<div
				class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400"
			>
				<AlertCircle class="h-7 w-7" />
			</div>
			<h3 class="mb-2 text-lg font-bold text-text-main">Gagal Memuat Berita</h3>
			<p class="text-xs leading-relaxed text-text-muted">
				Terjadi kesalahan saat memuat daftar berita terbaru. Silakan coba muat ulang halaman.
			</p>
		</div>
	{/await}
</section>
