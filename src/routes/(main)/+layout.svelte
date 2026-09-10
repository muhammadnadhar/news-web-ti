<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import MainFooter from './_components/mainFooter.svelte';
	import { X } from 'lucide-svelte';
	import uinIcon from '$lib/assets/uin-icon.svg'; // Sesuaikan path

	import { Apptheme } from '$lib/global/theme';

	let { children } = $props();

	onMount(() => {
		Apptheme.init();
	});

	let isDrawerOpen = $state(false);

	function toggleDrawer() {
		isDrawerOpen = !isDrawerOpen;
	}
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
		<Navbar />
	</header>

	<!-- CONTENT RENDER (SvelteKit Slot) -->
	<div class="grow">
		<!-- <slot /> -->
		{@render children()}
	</div>

	<!-- FOOTER GLOBAL -->
	<MainFooter />

	<!-- DRAWER NAVIGATION GLOBAL -->
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
