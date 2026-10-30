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
		Target,
		History,
		Network,
		UserCheck,
		Award,
		FlaskConical,
		Calendar,
		FileText,
		Briefcase,
		ClipboardList,
		BookMarked,
		Layers,
		ListOrdered,
		Trophy,
		Medal,
		Search,
		FileUp,
		FileCheck2,
		Building2,
		Camera,
		ChevronLeft,
		User
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
		Newspaper,
		Target,
		History,
		Network,
		UserCheck,
		Award,
		FlaskConical,
		Calendar,
		FileText,
		Briefcase,
		ClipboardList,
		BookMarked,
		Layers,
		ListOrdered,
		Trophy,
		Medal,
		Search,
		FileUp,
		FileCheck2,
		Building2,
		Camera
	};
	import { page } from '$app/stores'; // Import store page dari SvelteKit
	import uinIcon from '$lib/assets/uin-icon.webp';
	import ThemeActionBtn from '../themeActionBtn.svelte';
	import BtnProfilAction from '../../../routes/(admin)/admin/user/_component/btnProfilAction.svelte';

	let currentPath = $derived($page.url.pathname);

	let isMobileOpen = $state(false);
	let isCollapsed = $state(false);
	let activePath = $state('/dashboard'); // Halaman aktif saat ini
	let activeHoveredSubMenu = $state<string | null>(null); // State untuk mengontrol floating menu saat collapsed

	function toggleMobile() {
		isMobileOpen = !isMobileOpen;
	}

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}
</script>

<header
	class="bg-bg-/95 sticky top-0 z-50 flex items-center justify-between border-b border-border-color/10 px-4 py-3 backdrop-blur-md lg:hidden"
>
	<button class="flex cursor-pointer gap-3.5 lg:hidden" onclick={() => goto('/')}>
		<img src={uinIcon} alt="UIN Ar-Raniry" class="h-8 w-8 object-contain" />
		<div>
			<span class="text-scitech-mint block text-xs font-bold tracking-wider">TI UIN AR-RANIRY</span>
			<span class="-mt-0.5 block text-[10px] text-text-muted">Control Panel</span>
		</div>
	</button>

	<div class="flex justify-end gap-3">
		<BtnProfilAction />

		<button
			onclick={toggleMobile}
			aria-label="Toggle Navigation"
			class="bg-scitech-slate hover:text-scitech-mint rounded-xl border border-border-color/10 p-2 text-text-main transition-colors"
		>
			{#if isMobileOpen}
				<X class="h-6 w-6" />
			{:else}
				<Menu class="h-6 w-6" />
			{/if}
		</button>
	</div>
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

<aside
	class="fixed top-0 left-0 z-45 flex h-full scrollbar-none flex-col justify-between overflow-hidden border-r border-border-color/10
         bg-bg-secondary/95 backdrop-blur-xl transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen
         {isMobileOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0'} 
         {isCollapsed ? 'lg:w-20' : 'lg:w-72'}"
>
	<!-- Bagian Atas: Header Sidebar khusus Mobile (agar logo & tombol close sejajar dan tidak tertutup) -->
	<div
		class="flex shrink-0 items-center justify-between border-b border-border-color/10 p-4 lg:hidden"
	>
		<div class="flex items-center gap-3 overflow-hidden">
			<img
				src={uinIcon}
				alt="Logo UIN Ar-Raniry"
				class="h-8 w-8 shrink-0 object-contain drop-shadow-[0_0_8px_rgba(79,209,197,0.3)] filter"
			/>
			<div class="overflow-hidden text-left">
				<h1 class="truncate text-xs font-extrabold tracking-wide text-text-main">TI AR-RANIRY</h1>
				<p class="text-scitech-mint truncate text-[10px] font-medium tracking-tight">
					Sistem Informasi
				</p>
			</div>
		</div>
		<button
			onclick={() => (isMobileOpen = false)}
			aria-label="Close Navigation"
			class="bg-scitech-slate hover:text-scitech-mint shrink-0 rounded-xl border border-border-color/10 p-1.5 text-text-main transition-colors"
		>
			<X class="h-5 w-5" />
		</button>
	</div>

	<!-- Tombol Logo khusus Desktop (Hidden di Mobile) -->
	<button
		class="hidden shrink-0 cursor-pointer items-center gap-3.5 border-b border-border-color/10 p-5 lg:flex"
		onclick={() => goto('/')}
	>
		<img
			src={uinIcon}
			alt="Logo UIN Ar-Raniry"
			class="h-10 w-10 shrink-0 object-contain drop-shadow-[0_0_8px_rgba(79,209,197,0.3)] filter"
		/>

		{#if !isCollapsed}
			<div class="overflow-hidden text-left transition-all duration-300">
				<h1 class="truncate text-sm font-extrabold tracking-wide text-text-main">TI AR-RANIRY</h1>
				<p class="text-scitech-mint truncate text-[11px] font-medium tracking-tight">
					Sistem Informasi
				</p>
			</div>
		{/if}
	</button>

	<!-- Area Menu yang bisa di-scroll secara independen -->
	<nav class="flex-1 scrollbar-none space-y-4 overflow-y-auto p-3 lg:space-y-6">
		{#each sidebarMenu as section}
			<div class="space-y-1.5">
				{#if !isCollapsed}
					<h2
						class="text-scitech-mint/70 mb-1.5 px-3 text-[10px] font-extrabold tracking-widest uppercase"
					>
						{section.category}
					</h2>
				{:else}
					<div class="mx-2 my-2 h-px bg-bg-secondary"></div>
				{/if}

				<!-- Menu Items -->
				{#each section.items as item}
					{@const IconComponent = iconMap[item.iconName] || Home}

					{#if item.children && item.children.length > 0}
						{#if !isCollapsed}
							<details class="group/details">
								<summary
									class="hover:bg-scitech-slate/80 flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-text-muted transition-all select-none hover:text-text-muted"
								>
									<div class="flex items-center gap-3">
										<IconComponent class="text-scitech-cyan h-4 w-4 shrink-0" />
										<span>{item.title}</span>
									</div>
									<ChevronRight
										class="h-3.5 w-3.5 text-text-muted transition-transform duration-300 group-open/details:rotate-90"
									/>
								</summary>

								<div class="relative mt-1 ml-5 space-y-1 border-l-2 border-border-color pl-3">
									{#each item.children as sub}
										{@const isSubActive = currentPath === sub.href}
										{@const SubIconComponent = iconMap[sub.iconName ?? 'Home']}

										<button
											type="button"
											onclick={() => {
												isMobileOpen = false;
												goto(sub.href);
											}}
											class="relative flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-all duration-200
    before:absolute before:top-1/2 before:-left-3.5 before:h-px before:w-2.5 before:content-['']
    {isSubActive
												? 'bg-scitech-mint/10 border-scitech-mint/30 text-scitech-mint border font-bold shadow-sm'
												: 'text-text-muted hover:bg-white/5 hover:text-text-main'}"
										>
											<SubIconComponent class="h-4 w-4 shrink-0 text-text-main" />
											<span>{sub.title}</span>
										</button>
									{/each}
								</div>
							</details>
						{:else}
							<!-- Tampilan saat Collapsed (Icon Only) -->
							{#if item.href}
								<button
									title={item.title}
									class="hover:bg-scitech-slate flex w-full items-center justify-center rounded-xl p-2.5 text-text-muted hover:text-text-muted"
								>
									<IconComponent class="h-5 w-5 text-text-main" />
								</button>

								{#if activeHoveredSubMenu === item.title}
									<div
										class="absolute top-0 left-full z-50 ml-2 w-56 rounded-2xl border border-border-color/30 bg-bg-secondary p-2 shadow-2xl backdrop-blur-xl"
									>
										<div class="border-b border-border-color/20 px-3 py-2">
											<span class="text-scitech-mint text-xs font-bold">{item.title}</span>
										</div>
									</div>
								{/if}
							{:else}
								{#each item.children as sub}
									{@const SubIconComponent = iconMap[sub.iconName ?? 'Home']}
									<button
										title={sub.title}
										onclick={() => goto(sub.href)}
										class="flex w-full items-center justify-center rounded-xl p-2.5 text-text-muted hover:bg-bg-secondary-hover hover:text-text-muted"
									>
										<SubIconComponent class="h-5 w-5 text-text-main" />
									</button>
								{/each}
							{/if}
						{/if}

						<!-- menu single (link biasa) -->
					{:else}
						{#if item.href}
							{@const isActive = activePath === item.href}

							<a
								href={item.href || '#'}
								onclick={() => {
									if (item.href) activePath = item.href;
									isMobileOpen = false;
								}}
								title={item.title}
								class="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200
{isActive
									? 'text-scitech-mint border-scitech-mint/40 shadow-scitech-mint/5 border bg-bg-secondary/15 shadow-lg'
									: 'text-text-muted hover:bg-bg-secondary-hover hover:text-text-main'}"
							>
								<IconComponent
									class="h-4 w-4 shrink-0 {isActive ? 'text-scitech-mint' : 'text-scitech-cyan'}"
								/>

								{#if !isCollapsed}
									<span>{item.title}</span>
								{/if}
							</a>
						{/if}
					{/if}
				{/each}
			</div>
		{/each}
	</nav>

	<!-- Bagian Bawah: ThemeActionBtn dan Toggle Collapse Desktop -->
	<div
		class="flex shrink-0 flex-col gap-2 border-t border-border-color/10 bg-bg-secondary/50 p-3 text-center"
	>
		<div class="w-full text-center">
			<ThemeActionBtn onlyIcon={isCollapsed} />
		</div>

		<div class="hidden w-full justify-center gap-1.5 pt-1 lg:flex">
			<button
				onclick={toggleCollapse}
				aria-label="Toggle Sidebar"
				class="bg-scitech-slate hover:bg-scitech-slate-hover hover:text-scitech-mint rounded-full border border-border-color p-2 text-text-muted shadow-md transition-all duration-200 active:scale-95"
			>
				<ChevronLeft
					class="h-4 w-4 transition-transform duration-300 {isCollapsed ? 'rotate-180' : ''}"
				/>
			</button>
		</div>
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
