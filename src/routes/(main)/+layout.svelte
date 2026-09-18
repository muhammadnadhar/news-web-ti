<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import MainFooter from './_components/mainFooter.svelte';
	import { X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { Apptheme } from '$lib/global/theme';
	import type { LayoutData } from '../$types';
	import type { SubMenuItem } from '$lib/types/navbar';
	import { navMenuItems } from '$lib/data/navbar';


	import uinIcon from '$lib/assets/uin-icon.svg'; // Sesuaikan path
	import GlobalSkeletonUser from '$lib/components/globalSkeletonUser.svelte';
	import { navigating } from '$app/state';
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
  let    timer: ReturnType<typeof setTimeout> | null = null;;
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

	// Helper function untuk memformat menu
	const formatSubMenu = (semesters: { semester: string }[], basePath: string): SubMenuItem[] => {
		return semesters.map((item) => ({
			id: item.semester.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
			label: item.semester,
			href: `${basePath}?semester=${encodeURIComponent(item.semester)}`
		}));
	};

	// Gabungkan navMenuItems statis dengan data dari server secara reaktif
	let dynamicNavMenu = $derived.by(() => {
		// Gunakan JSON.parse(JSON.stringify) DI SINI hanya untuk data semesternya,
		// TETAPI karena kita butuh Icon utuh, gunakan map() / spread operator untuk mutasi aman
		const menu = navMenuItems.map((m) => ({ ...m }));

		const kemahasiswaanMenu = menu.find((m) => m.id === 'kemahasiswaan');

		if (kemahasiswaanMenu && kemahasiswaanMenu.subMenu) {
			const prestasiAkademik = kemahasiswaanMenu.subMenu.find((c) => c.id === 'prestasi-akademik');
			if (prestasiAkademik && data.academic) {
				prestasiAkademik.subMenu = formatSubMenu(data.semesters.academic, prestasiAkademik.href);
			}

			const prestasiNonAkademik = kemahasiswaanMenu.subMenu.find(
				(c) => c.id === 'prestasi-non-akademik'
			);
			if (prestasiNonAkademik && data.semesters?.nonAcademic) {
				prestasiNonAkademik.subMenu = formatSubMenu(
					data.semesters.nonAcademic,
					prestasiNonAkademik.href
				);
			}

			const ipkTertinggi = kemahasiswaanMenu.subMenu.find(
				(c) => c.id === 'mahasiswa-ipk-tertinggi'
			);
			if (ipkTertinggi && data.semesters?.gpa) {
				ipkTertinggi.subMenu = formatSubMenu(data.semesters.gpa, ipkTertinggi.href);
			}
		}

		return menu;
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class="bg-scitech-navy selection:bg-scitech-mint flex min-h-screen flex-col justify-between text-text-main selection:text-text-dark"
>
	<header
		class="absolute top-0 right-0 left-0 z-30 flex w-full items-center justify-between px-6 pt-8 lg:px-12"
	>
		<a href="/" class="flex items-center gap-3">
			<div
				class="bg-scitech-navy-glare border-scitech-mint/30 flex h-12 w-12 items-center justify-center rounded-xl border p-2 shadow-lg"
			>
				<img src={uinIcon} class="text-scitech-mint h-7 w-7" alt="UIN Logo" />
			</div>
			<div>
				<h1 class="text-scitech-mint text-xs font-bold tracking-widest uppercase sm:text-sm">
					Prodi Teknologi Informasi
				</h1>
				<p class="text-[11px] font-medium text-text-muted sm:text-xs">
					Fakultas Sains dan Teknologi UIN Ar-Raniry
				</p>
			</div>
		</a>

		<!-- <Navbar onOpenDrawer={toggleDrawer} /> -->
		<Navbar navMenuItems={dynamicNavMenu} />
	</header>

	{#if showLoading}
		<GlobalSkeletonUser />
  {/if}

	<!-- content render (sveltekit slot) -->
	<div class="grow">
		<!-- <slot /> -->
		{@render children()}
	</div>

	<!-- footer GLOBAL -->
	<MainFooter />
	<!-- drawer navigation global -->
	{#if isDrawerOpen}
		<div
			class="bg-scitech-navy/95 fixed inset-0 z-50 flex flex-col justify-between p-8 backdrop-blur-2xl lg:p-16"
		>
			<div class="border-scitech-slate flex items-center justify-between border-b pb-6">
				<span class="text-lg font-bold text-white">Menu Utama</span>
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
