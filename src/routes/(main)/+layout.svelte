<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import MainFooter from './_components/mainFooter.svelte';
	import { AlertCircle, BookOpenIcon, RefreshCwIcon, X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { Apptheme } from '$lib/global/theme';
	import type { LayoutData } from '../$types';
	import { generateDynamicNavMenu } from '$lib/utils';

	import uinIcon from '$lib/assets/uin-icon.webp'; // Sesuaikan path
	import { navigating } from '$app/state';
	import NewsQuickDrawer from '$lib/components/newsQuickDrawer.svelte';
	import { invalidateAll } from '$app/navigation';
	import Spin from '$lib/components/loading/spin.svelte';
	import type { dymaicDataType } from '$lib/types/utils';
	interface Props {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();

	onMount(() => {
		Apptheme.init();
	});

	let isDrawerOpen = $state(false);

	let showLoading = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;
	const DELAY_MS = 300;

	function toggleDrawer() {
		isDrawerOpen = !isDrawerOpen;
	}

	// $effect akan otomatis berjalan setiap kali nilai $navigating berubah
	$effect(() => {
		// Membaca store $navigating (tetap reaktif di dalam $effect)
		const currentNavigating = navigating.to;

		if (currentNavigating) {
			if (!timer) {
				timer = setTimeout(() => {
					showLoading = true;
				}, DELAY_MS);
			}
		} else {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			showLoading = false;
		}

		// Fungsi cleanup otomatis jika komponen hancur
		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	});

	// Gabungkan navMenuItems statis dengan data dari server secara reaktif
	const dynamicMenu: dymaicDataType = data.navData;

	let dynamicNavMenu = $derived.by(() => generateDynamicNavMenu(dynamicMenu));
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class=" bg-scitech-navy flex min-h-screen flex-col justify-between text-text-main selection:bg-bg-secondary selection:text-text-dark"
>
	<header
		class="absolute top-0 right-0 left-0 z-30 flex w-full items-center justify-between px-6 pt-8 lg:px-12"
	>
		<a href="/" class="flex items-center gap-3">
			<div
				class=" flex h-16.5 w-16.5 items-center justify-center rounded-xl border-4 border-border-color/30 p-2 shadow-lg"
			>
				<img src={uinIcon} class=" h-[90%] w-[90%]" alt="UIN Logo" />
			</div>
			<div>
				<h1 class=" text-sm font-bold tracking-widest uppercase sm:text-xl">
					Prodi Teknologi Informasi
				</h1>
				<p class="text-[12px] font-medium sm:text-xs">Fakultas Sains dan Teknologi UIN Ar-Raniry</p>
			</div>
		</a>

		<!-- <Navbar onOpenDrawer={toggleDrawer} /> -->
		<Navbar navMenuItems={dynamicNavMenu} />
	</header>

	{#if showLoading}
		<Spin />
	{/if}

	<!-- content render (sveltekit slot) -->
	<div class="grow">
		<!-- <slot /> -->
		{@render children()}
	</div>

	{#await Promise.all([data.recentNews, data.newsCategories])}
		<div class="space-y-4 rounded-2xl border border-border-color bg-bg-secondary p-5 shadow-xs">
			<div class="flex items-center justify-between border-b border-border-color pb-3">
				<div class="flex items-center gap-2.5">
					<div class="h-8 w-8 animate-pulse rounded-xl bg-bg-primary"></div>
					<div class="h-4 w-32 animate-pulse rounded-md bg-bg-primary"></div>
				</div>
				<div class="h-3 w-16 animate-pulse rounded-md bg-bg-primary"></div>
			</div>

			<!-- Skeleton News Items -->
			<div class="space-y-3">
				{#each Array(3) as _}
					<div
						class="flex items-center gap-3.5 rounded-xl border border-border-color/60 bg-bg-primary p-3"
					>
						<div class="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-bg-secondary"></div>
						<div class="flex-1 space-y-2">
							<div class="h-3 w-1/4 animate-pulse rounded bg-bg-secondary"></div>
							<div class="h-4 w-5/6 animate-pulse rounded bg-bg-secondary"></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:then [news, categories]}
		<NewsQuickDrawer recentNews={news} {categories} />
	{:catch error}
		<div
			class="rounded-2xl border border-status-error/30 bg-status-error/10 p-5 text-status-error shadow-xs backdrop-blur-md"
		>
			<div class="flex items-start gap-3.5">
				<div
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-status-error/20 text-status-error"
				>
					<AlertCircle class="h-5 w-5" />
				</div>
				<div class="flex-1">
					<h4 class="text-xs font-bold tracking-wider uppercase">Gagal Memuat Berita</h4>
					<p class="mt-1 text-xs leading-relaxed opacity-90">
						{error?.message || 'Terjadi kesalahan sistem saat mengunduh data berita terbaru.'}
					</p>
					<!-- Tombol Muat Ulang (Retry) -->
					<button
						type="button"
						onclick={() => invalidateAll()}
						class="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-status-error/40 bg-status-error/20 px-3 py-1.5 text-xs font-semibold text-status-error transition hover:bg-status-error/30 active:scale-95"
					>
						<RefreshCwIcon class="h-3.5 w-3.5" />
						<span>Coba Lagi</span>
					</button>
				</div>
			</div>
		</div>
	{/await}

	<!-- Component yang menampilkan Berita terbaru  -->
	<!-- footer GLOBAL -->
	<MainFooter />
	<!-- drawer navigation global -->
	{#if isDrawerOpen}
		<div
			class="bg-scitech-navy/95 fixed inset-0 z-50 flex flex-col justify-between p-8 backdrop-blur-2xl lg:p-16"
		>
			<div class="border-scitech-slate flex items-center justify-between border-b pb-6">
				<span class="text-lg font-bold text-text-main">Menu Utama</span>
				<button
					onclick={toggleDrawer}
					class="bg-scitech-slate hover:bg-scitech-error rounded-xl p-2 transition-all"
				>
					<X class="h-6 w-6" />
				</button>
			</div>
			<div class="text-center text-sm text-text-muted">
				Navigasi lengkap dapat dikembangkan sesuai kebutuhan rute SvelteKit.
			</div>
			<div class="text-center text-xs text-text-muted">FST UIN Ar-Raniry Banda Aceh</div>
		</div>
	{/if}
</div>
