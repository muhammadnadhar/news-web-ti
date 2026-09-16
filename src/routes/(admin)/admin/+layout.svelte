<script lang="ts">
	import Sidebar from '$lib/components/admin/sidebar.svelte';
	import { Bell, User } from 'lucide-svelte';
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
					class="flex items-center gap-3 border-l border-border-color pl-4"
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
		<!-- Footer Copyright -->
		<footer
			class="bg-scitech-navy/90 border-t border-white/10 px-8 py-4 text-center font-mono text-xs text-text-muted"
		>
			<p>© 2026 Prodi Teknologi Informasi UIN Ar-Raniry Banda Aceh. All rights reserved.</p>
		</footer>
	</div>
</div>
