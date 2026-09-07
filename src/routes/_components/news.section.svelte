<script lang="ts">
	import { Calendar, ArrowRight, Sparkles } from 'lucide-svelte';

	interface NewsItem {
		id: string;
		title: string;
		category: string;
		date: string;
		image: string;
		summary: string;
		link: string;
	}

	const newsList: NewsItem[] = [
		{
			id: '1',
			title:
				'Read-Assist: Inovasi Mahasiswa TI UIN Ar-Raniry untuk Akses Belajar Mandiri Penyandang Tunanetra',
			category: 'Inovasi',
			date: '16 Juli 2026',
			image:
				'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
			summary:
				'Solusi kecerdasan buatan terapan untuk mempermudah literasi digital disabilitas netra.',
			link: '/berita/read-assist-inovasi'
		},
		{
			id: '2',
			title:
				'Prodi TI Melaksanakan Seminar Proposal Mahasiswa Semester 6 Dandy Sultana Putra Ali — Target lulus 3.5 tahun',
			category: 'Akademik',
			date: '30 Juni 2026',
			image:
				'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
			summary:
				'Apresiasi akselerasi masa studi mahasiswa berprestasi melalui bimbingan riset terstruktur.',
			link: '/berita/seminar-proposal-dandy'
		},
		{
			id: '3',
			title:
				'Workshop IoT & Artificial Intelligence: Mengembangkan Smart Campus Berbasis Cloud System',
			category: 'Riset & Tech',
			date: '12 Juni 2026',
			image:
				'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
			summary: 'Pelatihan praktis kolaborasi Laboratorium Komputer FST bersama praktisi industri.',
			link: '/berita/workshop-iot-ai'
		},
		{
			id: '4',
			title: 'Tim Mahasiswa TI UIN Ar-Raniry Raih Juara 1 Kompetisi Hackathon Nasional 2026',
			category: 'Prestasi',
			date: '01 Juni 2026',
			image:
				'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
			summary: 'Karya aplikasi pengelolaan lingkungan berbasis smart city memukau dewan juri.',
			link: '/berita/juara-1-hackathon'
		}
	];

	let scrollContainer = $state<HTMLDivElement | null>(null);
	let activeIndex = $state(0);

	// State untuk kontrol Drag Mouse
	let isDown = false;
	let startX = 0;
	let scrollLeftPos = 0;

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
			// e.preventDefault();
			scrollContainer.scrollLeft += e.deltaY * 1.2;
		}
	}

	// Fitur Click & Drag (Mouse Desktop)
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
		//		e.preventDefault();
		const x = e.pageX - scrollContainer.offsetLeft;
		const walk = (x - startX) * 1.5; // Kecepatan geser
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
</script>

<section class="relative w-full overflow-hidden py-16">
	<div class="mx-auto mb-10 max-w-xl px-6 text-center">
		<span
			class="text-scitech-mint mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
		>
			<Sparkles class="text-scitech-mint h-4 w-4" /> Information Hub
		</span>
		<h2 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Berita Terbaru</h2>
	</div>

	<!-- Container Scroll Interaktif -->
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
               border backdrop-blur-md transition-all duration-500 ease-out sm:w-[360px]
               {isActive
					? 'border-scitech-mint/60 shadow-scitech-mint/10 z-20 scale-110 opacity-100 shadow-2xl'
					: 'z-10 scale-90 border-white/10 opacity-40 blur-[0.3px]'}"
			>
				<div>
					<div class="bg-scitech-navy relative h-44 w-full overflow-hidden sm:h-48">
						<img
							src={news.image}
							alt={news.title}
							class="pointer-events-none h-full w-full object-cover transition-transform duration-700 {isActive
								? 'scale-105'
								: 'scale-100'}"
							draggable="false"
							loading="lazy"
						/>

						<span
							class="bg-scitech-navy/80 text-scitech-mint border-scitech-mint/30 absolute top-3 left-3 rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-md backdrop-blur-md"
						>
							{news.category}
						</span>
					</div>

					<div class="p-5">
						<div class="text-text-muted mb-2 flex items-center gap-1.5 text-xs">
							<Calendar class="text-scitech-cyan h-3.5 w-3.5" />
							<span>{news.date}</span>
						</div>

						<h3
							class="mb-2 line-clamp-2 text-sm leading-snug font-bold text-white sm:text-base {isActive
								? 'text-white'
								: 'text-white/80'}"
						>
							{news.title}
						</h3>

						<p class="text-text-muted line-clamp-2 text-xs leading-relaxed">
							{news.summary}
						</p>
					</div>
				</div>

				<div class="px-5 pt-1 pb-5">
					<a
						href={news.link}
						class="text-scitech-mint hover:text-scitech-mint-hover inline-flex items-center gap-2 text-xs font-bold transition-all"
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
</section>

<style>
	.scrollbar-none::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-none {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
