<script lang="ts">
	import { fly, fade, slide } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { Menu, X, ChevronDown } from 'lucide-svelte';
	import { type NavMenuItemType } from '$lib/types/navbar';

	import ThemeActionBtn from './themeActionBtn.svelte';
	import NavbarSub from './navbarSub.svelte';

	interface Props {
		navMenuItems: NavMenuItemType[];
	}

	let { navMenuItems = [] }: Props = $props();

	let scrollY = $state(0);
	let isOpen = $state(false);
	let activeDesktopMenu = $state<NavMenuItemType | null>(null);
	let activeMobileMenuId = $state<string | null>(null);
	let desktopNavRef = $state<HTMLElement | null>(null);

	function toggleMenu() {
		isOpen = !isOpen;
		if (!isOpen) {
			activeMobileMenuId = null;
		}
	}

	function handleWindowClick(event: MouseEvent) {
		if (activeDesktopMenu && desktopNavRef && !desktopNavRef.contains(event.target as Node)) {
			activeDesktopMenu = null;
		}
	}

	function handleDesktopClick(item: NavMenuItemType) {
		if (item.subMenu && item.subMenu.length > 0) {
			activeDesktopMenu = activeDesktopMenu?.id === item.id ? null : item;
		} else {
			activeDesktopMenu = null;
			if (item.href) window.location.href = item.href;
		}
	}

	// Handler Hover Mouse saat masuk
	function handleMouseEnter(item: NavMenuItemType) {
		if (window.matchMedia('(hover: hover)').matches && item.subMenu && item.subMenu.length > 0) {
			activeDesktopMenu = item;
		}
	}

	// Handler Hover Mouse saat keluar
	function handleMouseLeave() {
		if (window.matchMedia('(hover: hover)').matches) {
			activeDesktopMenu = null;
		}
	}

	function handleMobileClick(item: NavMenuItemType) {
		if (item.subMenu && item.subMenu.length > 0) {
			activeMobileMenuId = activeMobileMenuId === item.id ? null : item.id;
		} else {
			isOpen = false;
			activeMobileMenuId = null;
			if (item.href) window.location.href = item.href;
		}
	}
</script>

<svelte:window bind:scrollY onclick={handleWindowClick} />

<!-- ==================== desktop navbar ==================== -->
<div bind:this={desktopNavRef} class="fixed top-6 right-6 z-50 hidden text-text-main md:block">
	<nav
		class="bg-scitech-navy/80 flex items-center gap-3 rounded-2xl border border-white/10 p-2 shadow-2xl backdrop-blur-md"
	>
		{#each navMenuItems as item (item.id)}
			<!-- Pembungkus Tombol & Submenu dengan event hover -->
			<div
				class="relative"
				onmouseenter={() => handleMouseEnter(item)}
				onmouseleave={handleMouseLeave}
			>
				<button
					title={item.label}
					onclick={() => handleDesktopClick(item)}
					class="group relative flex items-center justify-center rounded-xl p-2.5 transition-all duration-200 {item.bgClass ??
						''} {activeDesktopMenu?.id === item.id ? 'ring-scitech-mint scale-105 ring-2' : ''}"
				>
					<item.icon class="h-5 w-5 transition-transform group-hover:scale-110" />

					{#if item.badge}
						<span
							class="border-scitech-navy bg-scitech-error absolute -top-1 -right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full border-2 text-[10px] font-bold text-text-main"
						>
							{item.badge}
						</span>
					{/if}
				</button>

				{#if activeDesktopMenu?.id === item.id && item.subMenu && item.subMenu.length > 0}
					<div
						transition:fly={{ y: -10, duration: 200 }}
						class="absolute top-auto left-0 z-50 w-96 -translate-x-1/2 transform pt-2"
					>
						<NavbarSub item={activeDesktopMenu} />
					</div>
				{/if}
			</div>
		{/each}

		<ThemeActionBtn />
	</nav>
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
			{#each navMenuItems as item, index (item.id)}
				<div
					in:fly={{ y: 20, duration: 250, delay: index * 50, easing: backOut }}
					out:fly={{ y: 15, duration: 150, delay: (navMenuItems.length - 1 - index) * 30 }}
					class="flex flex-col overflow-hidden rounded-xl"
				>
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
										class="bg-scitech-error absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-text-main"
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

					{#if activeMobileMenuId === item.id}
						<div transition:slide={{ duration: 200 }} class="pt-2">
							<NavbarSub {item} />
						</div>
					{/if}
				</div>
			{/each}
			<ThemeActionBtn />
		</div>
	{/if}

	<button
		onclick={toggleMenu}
		aria-label="Toggle Navigation Menu"
		class="border-scitech-navy bg-bg-secondary text-scitech-navy shadow-scitech-mint/20 fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
	>
		{#if isOpen}
			<X class="h-6 w-6 rotate-90 transition-transform" />
		{:else}
			<Menu class="h-6 w-6" />
		{/if}
	</button>
</div>
