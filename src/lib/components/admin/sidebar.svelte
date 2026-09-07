<script lang="ts">
	import {
		Gauge,
		UserCog,
		CalendarRange,
		Users,
		Home,
		BadgeInfo,
		Newspaper,
		ChevronRight,
		Menu,
		X,
		ChevronLeft
	} from 'lucide-svelte';

	import { sidebarMenu } from '$lib/data/sidebar';

	import { goto } from '$app/navigation';
	// Pemetaan Ikon Lucide
	const iconMap: Record<string, any> = {
		Gauge,
		UserCog,
		CalendarRange,
		Users,
		Home,
		BadgeIdentity: BadgeInfo,
		Newspaper
	};
	import { page } from '$app/stores'; // Import store page dari SvelteKit

	let currentPath = $derived($page.url.pathname);

	// Svelte 5 Runes State
	let isMobileOpen = $state(false);
	let isCollapsed = $state(false);
	let activePath = $state('/dashboard'); // Halaman aktif saat ini

	function toggleMobile() {
		isMobileOpen = !isMobileOpen;
	}

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}
</script>

<!-- topbar mobile (tampil hanya di layar kecil < lg) -->
<header
	class="bg-scitech-navy/95 sticky top-0 z-50 flex items-center justify-between border-b border-white/10 px-4 py-3 backdrop-blur-md lg:hidden"
>
	<div class="flex items-center gap-3">
		<img
			src="https://upload.wikimedia.org/wikipedia/commons/2/23/Logo_UIN_Ar-Raniry.png"
			alt="UIN Ar-Raniry"
			class="h-8 w-8 object-contain"
		/>
		<div>
			<span class="text-scitech-mint block text-xs font-bold tracking-wider">TI UIN AR-RANIRY</span>
			<span class="text-text-muted -mt-0.5 block text-[10px]">Control Panel</span>
		</div>
	</div>

	<button
		onclick={toggleMobile}
		aria-label="Toggle Navigation"
		class="bg-scitech-slate hover:text-scitech-mint rounded-xl border border-white/10 p-2 text-white transition-colors"
	>
		{#if isMobileOpen}
			<X class="h-6 w-6" />
		{:else}
			<Menu class="h-6 w-6" />
		{/if}
	</button>
</header>

<!-- BACKDROP MOBILE -->
{#if isMobileOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => (isMobileOpen = false)}
		class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
	></div>
{/if}

<!-- SIDEBAR UTAMA (Sticky & Responsive Drawer) -->
<aside
	class="bg-scitech-navy/95 fixed top-0 left-0 z-40 flex h-screen scrollbar-none flex-col justify-between
         overflow-y-auto border-r border-white/10 backdrop-blur-xl transition-all duration-300 ease-in-out lg:sticky
         {isMobileOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0'} 
         {isCollapsed ? 'lg:w-20' : 'lg:w-72'}"
>
	<!-- Sidebar Header / Logo -->
	<div>
		<div class="flex items-center gap-3.5 border-b border-white/10 p-5">
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/2/23/Logo_UIN_Ar-Raniry.png"
				alt="Logo UIN Ar-Raniry"
				class="h-10 w-10 shrink-0 object-contain drop-shadow-[0_0_8px_rgba(79,209,197,0.3)] filter"
			/>

			{#if !isCollapsed}
				<div class="overflow-hidden transition-all duration-300">
					<h1 class="truncate text-sm font-extrabold tracking-wide text-white">TI AR-RANIRY</h1>
					<p class="text-scitech-mint truncate text-[11px] font-medium tracking-tight">
						Sistem Informasi
					</p>
				</div>
			{/if}
		</div>

		<!-- Navigation List -->
		<nav class="space-y-6 p-3">
			{#each sidebarMenu as section}
				<div class="space-y-1.5">
					<!-- Category Title Header -->
					{#if !isCollapsed}
						<h2
							class="text-scitech-mint/70 mb-2 px-3 text-[10px] font-extrabold tracking-widest uppercase"
						>
							{section.category}
						</h2>
					{:else}
						<div class="mx-2 my-3 h-px bg-white/10"></div>
					{/if}

					<!-- Menu Items -->
					{#each section.items as item}
						{@const IconComponent = iconMap[item.iconName] || Home}

						{#if item.children && item.children.length > 0}
							{#if !isCollapsed}
								<details class="group/details">
									<summary
										class="text-text-muted hover:bg-scitech-slate/80 flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all select-none hover:text-white"
									>
										<div class="flex items-center gap-3">
											<IconComponent class="text-scitech-cyan h-4 w-4 shrink-0" />
											<span>{item.title}</span>
										</div>
										<ChevronRight
											class="text-text-muted h-3.5 w-3.5 transition-transform duration-300 group-open/details:rotate-90"
										/>
									</summary>

									<div class="relative mt-1 ml-5 space-y-1 border-l-2 border-white/10 pl-3">
										{#each item.children as sub}
											{@const isSubActive = currentPath === sub.href}

											<button
												type="button"
												onclick={() => {
													isMobileOpen = false;
													goto(sub.href);
												}}
												class="relative flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-200
		before:absolute before:top-1/2 before:-left-3.5 before:h-px before:w-2.5 before:bg-white/20 before:content-['']
		{isSubActive
													? 'bg-scitech-mint/10 border-scitech-mint/30 text-scitech-mint border font-bold shadow-sm'
													: 'text-text-muted hover:bg-white/5 hover:text-white'}"
											>
												<span>{sub.title}</span>
											</button>
										{/each}
									</div>
								</details>
							{:else}
								<!-- Tampilan saat Collapsed (Icon Only) -->
								<button
									title={item.title}
									class="text-text-muted hover:bg-scitech-slate flex w-full items-center justify-center rounded-xl p-3 hover:text-white"
								>
									<IconComponent class="text-scitech-cyan h-5 w-5" />
								</button>
							{/if}

							<!-- menu single (link biasa) -->
						{:else}
							{@const isActive = activePath === item.href}
							<a
								href={item.href || '#'}
								onclick={() => {
									if (item.href) activePath = item.href;
									isMobileOpen = false;
								}}
								title={item.title}
								class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200
                       {isActive
									? 'bg-scitech-mint/15 text-scitech-mint border-scitech-mint/40 shadow-scitech-mint/5 border shadow-lg'
									: 'text-text-muted hover:bg-scitech-slate/80 hover:text-white'}"
							>
								<IconComponent
									class="h-4 w-4 shrink-0 {isActive ? 'text-scitech-mint' : 'text-scitech-cyan'}"
								/>

								{#if !isCollapsed}
									<span>{item.title}</span>
								{/if}
							</a>
						{/if}
					{/each}
				</div>
			{/each}
		</nav>
	</div>

	<!-- Sidebar Footer / Collapse Toggle (Desktop Only) -->
	<div class="hidden justify-center border-t border-white/10 p-3 lg:flex">
		<button
			onclick={toggleCollapse}
			aria-label="Toggle Sidebar"
			class="bg-scitech-slate hover:bg-scitech-slate-hover text-text-muted hover:text-scitech-mint rounded-full border border-white/10 p-2.5 shadow-md transition-all duration-200 active:scale-95"
		>
			<ChevronLeft
				class="h-5 w-5 transition-transform duration-300 {isCollapsed ? 'rotate-180' : ''}"
			/>
		</button>
	</div>
</aside>

<style>
	/* Menghilangkan panah bawaan HTML <details> / <summary> */
	summary::-webkit-details-marker {
		display: none;
	}
	summary {
		list-style: none;
	}

	/* Scrollbar kustom halus */
	.scrollbar-none::-webkit-scrollbar {
		width: 0px;
		display: none;
	}
	.scrollbar-none {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
