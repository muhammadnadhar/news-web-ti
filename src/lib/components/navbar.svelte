<script lang="ts">
	import { fly, fade, slide } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { Menu, X, ChevronDown, Moon, Sun } from 'lucide-svelte';
	import { menuItems } from '$lib/data/menu';
	import { type MenuItem } from '$lib/types/navbar';

	import NavbarSub from '$lib/components/navbar.sub.svelte';
	import ThemeActionBtn from './themeActionBtn.svelte';

	//  State Svelte 5 untuk menangkap posisi scroll Y
	let scrollY = $state(0);

	//  State turunan ($derived): true jika scrolled lebih dari 20px
	let isScrolled = $derived(scrollY > 50);

	// State menu mobile & submenu
	let isOpen = $state(false);
	let activeDesktopMenu = $state<MenuItem | null>(null);
	let activeMobileMenuId = $state<string | null>(null);

	// Toggle drawer floating mobile
	function toggleMenu() {
		isOpen = !isOpen;
		if (!isOpen) {
			activeMobileMenuId = null;
		}
	}

	// Handle klik menu di desktop
	function handleDesktopClick(item: MenuItem) {
		if (activeDesktopMenu?.id === item.id) {
			activeDesktopMenu = null;
		} else {
			activeDesktopMenu = item;
		}
	}

	// Handle klik menu di mobile
	function handleMobileClick(item: MenuItem) {
		if (item.subMenu && item.subMenu.length > 0) {
			activeMobileMenuId = activeMobileMenuId === item.id ? null : item.id;
		} else {
			isOpen = false;
			activeMobileMenuId = null;
		}
	}
</script>

<!-- ==================== desktop navbar ==================== -->
<div
	class=" fixed top-auto right-6 z-50 hidden md:block {isScrolled
		? 'text-scitech-navy scale-100 border-slate-200/80 bg-white shadow-2xl backdrop-blur-xl'
		: 'bg-scitech-navy/30 hover:bg-scitech-navy/60 scale-95 border-white/5 text-white shadow-none'}"
>
	<nav
		class="bg-scitech-navy/80 flex items-center gap-3 rounded-2xl border border-white/10 p-2 shadow-2xl backdrop-blur-md"
	>
		{#each menuItems as item (item.id)}
			<button
				title={item.label}
				onclick={() => handleDesktopClick(item)}
				class="group relative flex items-center justify-center rounded-xl p-2.5 transition-all duration-200 {item.bgClass ??
					''} {activeDesktopMenu?.id === item.id ? 'ring-scitech-mint scale-105 ring-2' : ''}"
			>
				<item.icon class="h-5 w-5 transition-transform group-hover:scale-110" />

				{#if item.badge}
					<span
						class="bg-scitech-error border-scitech-navy absolute -top-1 -right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full border-2 text-[10px] font-bold text-white"
					>
						{item.badge}
					</span>
				{/if}
			</button>
		{/each}

		<!-- action button: theme toggle switcher -->
		<ThemeActionBtn />
	</nav>

	<!-- Overlay Penutup Dropdown Desktop saat diklik di luar -->
	{#if activeDesktopMenu}
		<button
			onclick={() => (activeDesktopMenu = null)}
			class="fixed inset-0 z-40 h-full w-full cursor-default border-none bg-transparent"
			aria-label="Close Dropdown"
			tabindex="-1"
		></button>

		<!-- Submenu Dropdown Card Floating Desktop -->
		<div
			transition:fly={{ y: -10, duration: 200 }}
			class="absolute top-full right-0 z-50 mt-3 w-96"
		>
			<NavbarSub item={activeDesktopMenu} />
		</div>
	{/if}
</div>

<!-- ==================== mobile floating menu ==================== -->
<div class="md:hidden">
	{#if isOpen}
		<button
			onclick={toggleMenu}
			aria-label="Tutup Menu"
			aria-hidden="true"
			tabindex="-1"
			class="bg-scitech-navy/70 fixed inset-0 z-40 h-full w-full cursor-default border-none backdrop-blur-sm"
			transition:fade={{ duration: 200 }}
		></button>
	{/if}

	{#if isOpen}
		<div
			class="bg-scitech-slate/95 fixed right-6 bottom-24 z-50 flex max-h-[70vh] max-w-[calc(100vw-3rem)] min-w-[280px] flex-col gap-2.5 overflow-y-auto rounded-2xl border border-white/15 p-2.5 shadow-2xl backdrop-blur-xl"
		>
			{#each menuItems as item, index (item.id)}
				<div
					in:fly={{ y: 20, duration: 250, delay: index * 50, easing: backOut }}
					out:fly={{ y: 15, duration: 150, delay: (menuItems.length - 1 - index) * 30 }}
					class="flex flex-col overflow-hidden rounded-xl"
				>
					<!-- Tombol Menu Utama -->
					<button
						onclick={() => handleMobileClick(item)}
						class="flex items-center justify-between gap-3 p-3 transition-all duration-150 active:scale-98 {item.bgClass ??
							''}"
					>
						<span class="pl-1 text-xs font-semibold">{item.label}</span>

						<div class="flex items-center gap-2">
							<div class="relative flex items-center justify-center">
								<item.icon class="h-5 w-5 shrink-0" />
								{#if item.badge}
									<span
										class="bg-scitech-error absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
									>
										{item.badge}
									</span>
								{/if}
							</div>

							{#if item.subMenu && item.subMenu.length > 0}
								<ChevronDown
									class="h-4 w-4 transition-transform duration-200 {activeMobileMenuId === item.id
										? 'rotate-180'
										: ''}"
								/>
							{/if}
						</div>
					</button>

					<!-- Tampilan Submenu Mobile (Accordion dengan NavbarSub) -->
					{#if activeDesktopMenu || activeMobileMenuId === item.id}
						<div transition:slide={{ duration: 200 }} class="pt-2">
							<NavbarSub {item} />
						</div>
					{/if}
				</div>

				<!-- action button: theme toggle switcher -->
				<ThemeActionBtn />
			{/each}
		</div>
	{/if}

	<!-- Tombol Utama Hamburger / FAB (Mengambang Kanan Bawah) -->
	<button
		onclick={toggleMenu}
		aria-label="Toggle Navigation Menu"
		class="bg-scitech-mint text-scitech-navy shadow-scitech-mint/20 border-scitech-navy fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
	>
		{#if isOpen}
			<X class="h-6 w-6 rotate-90 transition-transform" />
		{:else}
			<Menu class="h-6 w-6" />
		{/if}
	</button>
</div>
