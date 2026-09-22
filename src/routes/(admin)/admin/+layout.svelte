<script lang="ts">
	import Sidebar from '$lib/components/admin/sidebar.svelte';
	import { Bell, CameraIcon, ExternalLinkIcon, GitBranchPlusIcon, User } from 'lucide-svelte';
	// import { navigating } from '$app/stores'; // depecrate
	import { navigating } from '$app/state';
	import { goto } from '$app/navigation';
	import CardSkeleton from '$lib/components/cardSkeleton.svelte';
	import { mergeNewPath } from '$lib/utils';

	let { children } = $props();

	let showLoading = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;
	const DELAY_MS = 300;

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
</script>

<div
	class="bg-scitech-navy selection:bg-scitech-mint selection:text-scitech-navy flex min-h-screen flex-col text-text-main antialiased lg:flex-row"
>
	<!-- Sidebar Navigation -->
	<Sidebar />

	<div class="flex min-h-screen min-w-0 flex-1 flex-col">
		<header
			class="sticky top-0 z-30 hidden items-center justify-between border-b border-border-color bg-bg-secondary/80 px-8 py-4 backdrop-blur-md lg:flex"
		>
			<div class="flex items-center gap-2 font-mono text-xs text-text-muted">
				<span class="text-scitech-mint">Portal Admin</span>
				<span>/</span>
				<span class="font-semibold text-text-main">Dataset Control Center</span>
			</div>

			<div class="flex items-center gap-5">
				<button
					class="bg-scitech-slate relative rounded-xl border border-border-color p-2 text-text-muted transition-all hover:bg-bg-primary hover:text-text-muted"
				>
					<Bell class="h-4 w-4" />
					<span class="bg-scitech-mint absolute top-1.5 right-1.5 h-2 w-2 animate-ping rounded-full"
					></span>
					<span class="bg-scitech-mint absolute top-1.5 right-1.5 h-2 w-2 rounded-full"></span>
				</button>

				<!-- Profile Badge -->
				<button
					onclick={() => goto(mergeNewPath('profil'))}
					class="flex items-center gap-3 border-l border-border-color pl-4 hover:cursor-pointer"
				>
					<div class="text-right">
						<span class="block text-xs font-bold text-text-main">Profile</span>
						<span class="text-scitech-mint block font-mono text-[10px]">Detailt</span>
					</div>

					<div
						class="from-scitech-mint to-scitech-cyan h-9 w-9 rounded-xl bg-gradient-to-tr p-0.5 shadow-md"
					>
						<div
							class="bg-scitech-navy flex h-full w-full items-center justify-center overflow-hidden rounded-[10px]"
						>
							<User class="text-scitech-mint h-5 w-5" />
						</div>
					</div>
				</button>
			</div>
		</header>

		<!-- jika masih navigasi  -->
		{#if showLoading}
			<CardSkeleton />
		{/if}
		<!-- Page Content Slot -->
		<main class="flex-1 p-4 sm:p-8">
			{@render children()}
		</main>

		<footer
			class="relative z-20 border-t border-border-color bg-bg-secondary/95 px-4 py-6 font-mono text-xs text-text-muted sm:px-8"
		>
			<div
				class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6"
			>
				<!-- Copyright Text -->
				<div class="text-center sm:text-left">
					<p class="font-semibold text-text-main">
						© 2026 <span class="text-scitech-mint">Prodi TI UIN Ar-Raniry</span> Banda Aceh.
					</p>
					<p class="mt-0.5 text-[11px] text-text-muted">All rights reserved. FST UIN Ar-Raniry.</p>
				</div>

				<!-- Links Actions (GitHub Repository & Instagram Designer) -->
				<div class="flex flex-wrap items-center justify-center gap-3">
					<a
						href="https://github.com/muhammadnadhar/news-web-ti"
						target="_blank"
						rel="noopener noreferrer"
						class="hover:bg-scitech-navy hover:text-scitech-mint inline-flex items-center gap-2 border border-border-color bg-bg-primary px-3 py-1.5 text-xs font-bold text-text-main shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.5)] active:scale-95"
						title="Lihat Repository GitHub Proyek"
					>
						<GitBranchPlusIcon class="text-scitech-cyan h-4 w-4" />
						<span>Source Code</span>
						<ExternalLinkIcon class="h-3 w-3 opacity-60" />
					</a>

					<!-- Link Designed By / Instagram -->
					<a
						href="https://www.instagram.com/nadhar2005/"
						target="_blank"
						rel="noopener noreferrer"
						class="hover:bg-scitech-navy hover:text-scitech-mint inline-flex items-center gap-1.5 border border-border-color bg-bg-primary px-3 py-1.5 text-xs font-bold text-text-main shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.5)] active:scale-95"
						title="Kunjungi Instagram Desainer"
					>
						<span>Developed by</span>
						<CameraIcon class="h-4 w-4 text-rose-400" />
						<span class="text-scitech-mint">@nadhar2005</span>
					</a>
				</div>
			</div>
		</footer>
	</div>
</div>
