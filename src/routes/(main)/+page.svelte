<script lang="ts">
	import GetStartedCard from '$lib/components/get.started.svelte';

	import NewsSection from './_components/newsSection.svelte';
	import HomeSection from './_components/homeSection.svelte';
	import fstImg from '$lib/assets/fst.png';
	import uinFrontImg from '$lib/assets/uin-front.jpg';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { data } = $props();

	// (Menggunakan $derived agar data tetap reaktif jika terjadi pembaruan)
	let recentNews = $derived(data.recentNews);

	const images = [fstImg, uinFrontImg];
	let captions = $state([
		'Sinergi Kebangsaan, Energi Membangun Negeri',
		'Hidup Prodi TI!',
		'Bismillah Sidang!'
	]);

	let currentIndex = $state(0);
	let isPlaying = $state(true); // State status animasi (Play/Stop)

	let isTabActive = $state(true);

	// Derived State untuk mengambil teks sesuai index gambar aktif
	let currentText = $derived(captions[currentIndex % captions.length] ?? '');

	// Handler Toggle Play / Pause
	function handleToggleAnimation() {
		isPlaying = !isPlaying;
	}

	// Fungsi untuk memperbarui kata-kata berdasarkan index tertentu
	function updateCaptionAtIndex(index: number, newText: string) {
		if (index >= 0 && index < captions.length) {
			captions[index] = newText;
		}
	}

	// Fungsi untuk menambah kata-kata baru ke dalam list
	function addCaption(newText: string) {
		captions = [...captions, newText];
	}

	// Fungsi untuk mengganti seluruh array kata-kata
	function setAllCaptions(newCaptions: string[]) {
		captions = newCaptions;
	}

	// Toggle Play/Pause
	function toggleAnimation() {
		isPlaying = !isPlaying;
	}

	// untuk mencegah animasi jalan jika tab tidak di lihat ( performance )
	onMount(() => {
		const handleVisibility = () => {
			isTabActive = !document.hidden;
		};
		document.addEventListener('visibilitychange', handleVisibility);
		return () => document.removeEventListener('visibilitychange', handleVisibility);
	});

	$effect(() => {
		// Jalankan timer hanya jika status isPlaying === true
		if (!isPlaying) return;

		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<!-- Hero Section 100vh -->
<section class="relative flex h-screen min-h-170 w-full flex-col justify-end">
	<!-- <header class="relative z-20 flex w-full items-center justify-between px-6 pt-16 lg:px-12"> -->
	<!-- 	<div class="flex items-center gap-3"> -->
	<!-- 		<div -->
	<!-- 			class="bg-scitech-navy-glare border-scitech-mint/30 flex h-12 w-12 items-center justify-center rounded-xl border p-2 shadow-lg" -->
	<!-- 		> -->
	<!-- 			<!-- <Atom class="text-scitech-mint h-7 w-7" /> --> -->
	<!-- 			<img src={uinIcon} class="text-scitech-mint h-7 w-7" alt="UIN Logo" /> -->
	<!-- 		</div> -->
	<!-- 		<div> -->
	<!-- 			<h1 class="text-scitech-mint text-xs font-bold tracking-widest uppercase sm:text-sm"> -->
	<!-- 				Prodi Teknologi Informasi -->
	<!-- 			</h1> -->
	<!-- 			<p class="text-[11px] font-medium text-text-muted sm:text-xs"> -->
	<!-- 				Fakultas Sains dan Teknologi UIN Ar-Raniry -->
	<!-- 			</p> -->
	<!-- 		</div> -->
	<!-- 	</div> -->
	<!---->
	<!-- 	<Navbar onOpenDrawer={toggleDrawer} /> -->
	<!-- </header> -->
	<!---->
	<!-- Gambar Utama -->
	<div class="absolute inset-0 z-0 overflow-hidden">
		<!-- <img -->
		<!-- 	src={fstImg} -->
		<!-- 	alt="Gedung FST UIN Ar-Raniry" -->
		<!-- 	class="h-full w-full scale-105 object-cover object-center filter dark:brightness-75 dark:contrast-110" -->
		<!-- /> -->
		{#if isTabActive}
			{#key currentIndex}
				<img
					src={images[currentIndex]}
					alt="Hero Background"
					transition:fade={{ duration: 1000 }}
					class="animate-hero-zoom absolute inset-0 h-full w-full object-cover object-center filter dark:brightness-75 dark:contrast-110"
				/>
			{/key}
		{/if}
		<div class="bg-scitech-navy/65 absolute inset-0 hidden mix-blend-multiply dark:block"></div>
		<div
			class="from-scitech-navy/90 via-scitech-navy/30 to-scitech-navy absolute inset-0 hidden bg-gradient-to-b dark:block"
		></div>
	</div>

	<!-- Bottom Left Card Get Started -->
	<div class="relative z-20 mb-16 px-6 lg:px-12">
		{#if isTabActive}
			<GetStartedCard {isPlaying} {currentText} onToggleAnimation={handleToggleAnimation} />
		{/if}
	</div>

	<!-- Thin Vector Wave SVG -->
	<!-- Vector Wave SVG (2 Layer + Accent Line) -->
	<div class="pointer-events-none absolute right-0 bottom-0 left-0 z-10">
		<svg class="h-20 w-full sm:h-32" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
			<defs>
				<linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stop-color="#22d3ee" />
					<stop offset="50%" stop-color="#a7f3d0" />
					<stop offset="100%" stop-color="#818cf8" />
				</linearGradient>
			</defs>
			<!-- lapisan 1: gelombang belakang (redup & beri efek kedalaman/bayangan) -->
			<path
				d="M0,45 C320,85 640,35 1000,80 C1200,100 1360,65 1440,25 L1440,120 L0,120 Z"
				fill="var(--bg-secondary)"
				opacity="0.5"
			/>
			<!-- lapisan 2: gelombang depan solid navy (#0b192c) - mengikuti garis sketsa -->
			<path
				d="M0,65 C340,95 680,68 1050,95 C1240,108 1360,70 1440,40 L1440,120 L0,120 Z"
				fill="var(--bg-primary)"
			/>
			<!-- garis aksen: tipis & glowing menempel di atas gelombang utama -->
			<!-- <path -->
			<!-- 	d="M0,64 C340,94 680,67 1050,94 C1240,107 1360,69 1440,39" -->
			<!-- 	stroke="url(#wave-gradient)" -->
			<!-- 	stroke-width="2.5" -->
			<!-- 	fill="none" -->
			<!-- 	opacity="0.85" -->
			<!-- /> -->
		</svg>
	</div>
</section>

<main id="main" class="mx-auto max-w-7xl space-y-16 px-6 py-12 lg:px-12">
	<NewsSection {recentNews} />

	<!---->
	<!-- <section class="bg-scitech-navy-glare border-scitech-slate rounded-3xl border p-8"> -->
	<!-- 	<div class="mb-6 flex items-center justify-between"> -->
	<!-- 		<h3 class="text-xl font-bold text-text-main">Berita & Pengumuman Terbaru</h3> -->
	<!-- 		<button -->
	<!-- 			on:click={() => (isLoading = !isLoading)} -->
	<!-- 			class="bg-scitech-slate hover:bg-scitech-slate-hover text-scitech-mint rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs" -->
	<!-- 		> -->
	<!-- 			Toggle Skeleton ({isLoading ? 'ON' : 'OFF'}) -->
	<!-- 		</button> -->
	<!-- 	</div> -->
	<!---->
	<!-- 	{#if isLoading} -->
	<!-- 		<SkeletonLoader count={8} /> -->
	<!-- 	{:else} -->
	<!-- 		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"> -->
	<!-- 			{#each Array(8) as _, i} -->
	<!-- 				<div -->
	<!-- 					class="bg-scitech-slate border-scitech-slate-hover hover:border-scitech-mint/40 group rounded-2xl border p-4 transition-all" -->
	<!-- 				> -->
	<!-- 					<div -->
	<!-- 						class="bg-scitech-navy mb-4 flex h-32 w-full flex-col justify-between rounded-xl p-3" -->
	<!-- 					> -->
	<!-- 						<span -->
	<!-- 							class="bg-scitech-mint-dim text-scitech-mint border-scitech-mint/30 w-fit rounded border px-2 py-0.5 text-[10px] font-bold" -->
	<!-- 						> -->
	<!-- 							Akademik -->
	<!-- 						</span> -->
	<!-- 					</div> -->
	<!-- 					<h5 -->
	<!-- 						class="group-hover:text-scitech-mint text-xs font-bold text-text-main transition-colors" -->
	<!-- 					> -->
	<!-- 						Pengumuman Akademik #{i + 1} -->
	<!-- 					</h5> -->
	<!-- 					<span class="text-text-muted mt-1 inline-block text-[11px]">07 Sep 2026</span> -->
	<!-- 				</div> -->
	<!-- 			{/each} -->
	<!-- 		</div> -->
	<!-- 	{/if} -->
	<!-- </section> -->
</main>

<!-- <MainFooter /> -->

<!-- Drawer Navigation Menu -->
<!-- 	{#if isDrawerOpen} -->
<!-- 		<div -->
<!-- 			class="bg-scitech-navy/95 fixed inset-0 z-50 flex flex-col justify-between p-8 backdrop-blur-2xl lg:p-16" -->
<!-- 		> -->
<!-- 			<div class="border-scitech-slate flex items-center justify-between border-b pb-6"> -->
<!-- 				<span class="text-lg font-bold text-text-main">Menu Utama</span> -->
<!-- 				<button -->
<!-- 					on:click={toggleDrawer} -->
<!-- 					class="bg-scitech-slate hover:bg-scitech-error rounded-xl p-2 transition-all" -->
<!-- 				> -->
<!-- 					<X class="h-6 w-6" /> -->
<!-- 				</button> -->
<!-- 			</div> -->
<!-- 			<div class="text-center text-sm text-text-muted"> -->
<!-- 				Navigasi lengkap dapat dikembangkan sesuai kebutuhan rute SvelteKit. -->
<!-- 			</div> -->
<!-- 			<div class="text-center text-xs text-text-muted">FST UIN Ar-Raniry Banda Aceh</div> -->
<!-- 		</div> -->
<!-- 	{/if} -->
<!-- </div> -->
