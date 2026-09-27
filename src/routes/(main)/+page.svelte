<script lang="ts">
	import NewsSection from './_components/newsSection.svelte';
	import HomeSection from './_components/homeSection.svelte';
	import { onMount } from 'svelte';

	import GetStartedCard from './_components/get.started.svelte';
	import { BuildingIcon, ImageOffIcon, PlayIcon } from 'lucide-svelte';
	import fstImg from '$lib/assets/fst.webp';
	import type { ProfileDashboardDTO } from '$lib/dto/admin/home.js';
	import { fade } from 'svelte/transition';
	import Spin from '$lib/components/loading/spin.svelte';
	let { data } = $props();

	$inspect(data);

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

	// sementara aja | manual
	let videoUrl = 'https://drive.google.com/file/d/1T2lsUdBBipXG_MS2Npwcu1rVlDqNWjxn/view?t=0.019';

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
						<Spin />
					</div>
				{:then}
					{#if profileItems.length > 0}
						<!-- render semua gambar di dom (tanpa bongkar-pasang node) -->
						{#each profileItems as item, index (item.id || index)}
							{#key currentIndex}
								<img
									src={profileItems[currentIndex]?.image_path}
									alt={profileItems[currentIndex]?.title || 'Hero Background'}
									in:fade={{ duration: 1000 }}
									out:fade={{ duration: 1000 }}
									class="animate-hero-zoom absolute inset-0 h-full w-full transform-gpu object-cover object-center filter dark:brightness-90"
								/>
							{/key}
						{/each}
						<div
							class="pointer-events-none absolute inset-0 z-15 bg-black/20 backdrop-brightness-90"
						></div>
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
