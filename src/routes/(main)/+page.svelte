<script lang="ts">
	import NewsSection from './_components/newsSection.svelte';
	import HomeSection from './_components/homeSection.svelte';
	import { onMount } from 'svelte';

	import GetStartedCard from './_components/get.started.svelte';
	import { BuildingIcon, ImageOffIcon, PlayIcon } from 'lucide-svelte';
	import type { ProfileDashboardDTO } from '$lib/types/admin/home.js';
	import fstImg from '$lib/assets/fst.webp';
	let { data } = $props();

	// const images = [fstImg, uinFrontImg];
	// let captions = $state([
	//		'Sinergi Kebangsaan, Energi Membangun Negeri',
	//		'Hidup Prodi TI!',
	//		'Bismillah Sidang!'
	// 	]);
	let profileItems = $state<ProfileDashboardDTO[]>([]);
	// Mengambil array gambar dari data loader ( fallback ke array kosong jika null/undefined )

	let currentIndex = $state(0);
	let isPlaying = $state(true); // State status animasi (Play/Stop)

	let isTabActive = $state(true);

	// Handler Toggle Play / Pause
	function handleToggleAnimation() {
		isPlaying = !isPlaying;
	}

	let currentItem = $derived(profileItems[currentIndex]);
	let currentImage = $derived(currentItem?.image_path ?? '');

	// sementara aja
	let videoUrl = 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID';

	$effect(() => {
		data.profileImgDashboard.then((items) => {
			const validItems = items?.filter((item) => Boolean(item.image_path)) ?? [];
			profileItems = validItems;

			// Preload otomatis agar gambar langsung tersimpan di cache memori
			validItems.forEach((item) => {
				const img = new Image();
				img.src = item.image_path;
			});
		});
	});

	onMount(() => {
		const handleVisibility = () => {
			isTabActive = !document.hidden;
		};
		document.addEventListener('visibilitychange', handleVisibility);
		return () => document.removeEventListener('visibilitychange', handleVisibility);
	});

	// Derived state untuk teks aktif
	let currentText = $derived(profileItems[currentIndex]?.title ?? '');

	// Timer animasi
	$effect(() => {
		if (!isPlaying || !isTabActive || profileItems.length <= 1) return;

		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % profileItems.length;
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
		<section class="relative flex h-screen min-h-170 w-full flex-col justify-end">
			<!-- Container Gambar Utama -->
			<div class="absolute inset-0 z-0 overflow-hidden">
				{#await data.profileImgDashboard}
					<div class="absolute inset-0 flex items-center justify-center bg-bg-secondary">
						<div
							class="h-8 w-8 animate-spin rounded-full border-2 border-accent-purple border-t-transparent"
						></div>
					</div>
				{:then}
					{#if profileItems.length > 0}
						<!-- render semua gambar di dom (tanpa bongkar-pasang node) -->
						{#each profileItems as item, index (item.id || index)}
							<img
								src={item.image_path}
								alt={item.title || 'Hero Background'}
								class="animate-hero-zoom absolute inset-0 h-full w-full object-cover object-center filter transition-opacity duration-1000 ease-in-out dark:brightness-75 dark:contrast-110 {index ===
								currentIndex
									? 'z-10 opacity-100'
									: 'z-0 opacity-0'}"
							/>
						{/each}
						<!-- {#if currentText} -->
						<!--     <div -->
						<!--         class="absolute bottom-8 left-8 z-20 max-w-lg rounded-2xl border border-border-color bg-bg-secondary/70 p-4 backdrop-blur-md shadow-lg transition-all duration-500" -->
						<!--     > -->
						<!--         <p class="text-sm font-semibold tracking-wide text-text-main sm:text-base"> -->
						<!--             {currentText} -->
						<!--         </p> -->
						<!--     </div> -->
						<!-- {/if} -->
					{:else}
						<!-- Fallback Kosong -->
						<div
							class="absolute inset-0 flex flex-col items-center justify-center bg-bg-secondary p-6 text-center"
						>
							<div
								class="flex h-20 w-20 items-center justify-center rounded-3xl border border-border-color bg-bg-primary/50 text-text-muted shadow-inner"
							>
								<BuildingIcon class="h-10 w-10 opacity-50" />
							</div>
							<p class="mt-3 text-xs font-medium text-text-muted">
								Tidak ada gambar latar belakang
							</p>
						</div>
					{/if}
				{:catch error}
					<!-- Fallback Error -->
					<div
						class="absolute inset-0 flex flex-col items-center justify-center bg-bg-secondary p-6 text-center"
					>
						<div
							class="flex h-16 w-16 items-center justify-center rounded-2xl border border-status-error/30 bg-status-error/10 text-status-error"
						>
							<ImageOffIcon class="h-8 w-8" />
						</div>
						<p class="mt-3 text-xs font-medium text-status-error">Gagal memuat latar belakang</p>
					</div>
				{/await}
			</div>
			<!-- Bottom Left Card Get Started -->
			<div class="relative z-20 mb-16 px-6 lg:px-12">
				{#if isTabActive}
					<GetStartedCard {isPlaying} {currentText} onToggleAnimation={handleToggleAnimation} />
				{/if}
			</div>
		</section>

		<!-- Thin Vector Wave SVG -->
		<!-- Vector Wave SVG (2 Layer + Accent Line) -->
		<div class="pointer-events-none absolute right-0 bottom-0 left-0 z-10">
			<svg
				class="h-20 w-full sm:h-32"
				viewBox="0 0 1440 120"
				fill="none"
				preserveAspectRatio="none"
			>
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
	</div>
</section>

<div id="main">
	<NewsSection recentNews={data.recentNews} />
</div>

<HomeSection
	listDosen={data.listPrimaryDosen}
	listPerminatan={data.listPerminatan}
	listProfil={data.listProfil}
/>

<section
	class="relative w-full overflow-hidden border-y border-border-color bg-bg-secondary py-20 text-center"
>
	<div class="absolute inset-0 z-0">
		<img
			src={fstImg}
			alt="Gedung Fakultas Sains dan Teknologi"
			class="h-full w-full object-cover object-center brightness-40 contrast-120 filter"
		/>
		<!-- overlay warna utama sesuai tema -->
		<div class="absolute inset-0 bg-bg-primary/80 backdrop-blur-xs"></div>
	</div>

	<!--Konten Terpusat (Centered) -->
	<div class="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-6">
		<!-- Tombol Play Video (Brutalist 3D Style) -->
		<a
			href={videoUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="group mb-6 flex h-14 w-14 items-center justify-center border border-border-color bg-bg-secondary-hover text-text-dark
                   shadow-[0_4px_0_0_var(--border-color)] transition-all duration-300
                   hover:-translate-y-1 hover:scale-105 hover:shadow-[0_8px_0_0_var(--border-color)] sm:h-16 sm:w-16"
			aria-label="Putar Video Sekilas Fakultas Saintek"
		>
			<PlayIcon
				class="ml-1 h-7 w-7 fill-current transition-transform duration-300 group-hover:scale-110"
			/>
		</a>

		<h2
			class="mb-3 text-2xl font-extrabold tracking-tight text-accent-primary sm:text-3xl lg:text-4xl"
		>
			Sekilas Tentang Fakultas Saintek
		</h2>

		<p class="max-w-2xl text-xs leading-relaxed text-text-muted sm:text-sm lg:text-base">
			Temukan informasi lengkap terkait Fakultas Sains dan Teknologi UIN Ar-Raniry melalui video
			ini. Video ini akan menunjukkan kepada Anda setiap sudut ekosistem akademik, fasilitas
			laboratorium, dan lingkungan kampus kami.
		</p>
	</div>
</section>

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
