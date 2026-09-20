<script lang="ts">
	import { type NavMenuItemType, type SubMenuItem } from '$lib/types/navbar';
	import { ChevronDown, ChevronRight, Layers } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		item?: SubMenuItem;
	}

	let { item = [] }: Props = $props();

	let activeNestedId = $state<string | null>(null);

	function toggleNested(id: string) {
		activeNestedId = activeNestedId === id ? null : id;
	}
</script>

{#if item}
	<div
		class="bg-scitech-slate hover:border-scitech-mint/30 w-full rounded-2xl border border-white/10 p-5 shadow-xl transition-all duration-300"
	>
		<div class="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
			<div class="flex items-center gap-3">
				<!-- Icon dengan Background khusus dari MenuItem -->
				<div class="flex shrink-0 items-center justify-center rounded-xl p-2.5">
					<item.icon class="h-5 w-5" />
				</div>
				<div>
					<h3 class="text-base font-bold tracking-wide text-text-main">{item.label}</h3>
					<p class="text-11 text-text-muted">Navigasi Halaman</p>
				</div>
			</div>

			<!-- Indicator Jumlah Sub Menu -->
			{#if item.subMenu && item.subMenu.length > 0}
				<span
					class="bg-scitech-mint-dim text-scitech-mint border-scitech-mint/20 rounded-full border px-2.5 py-1 text-[10px] font-semibold"
				>
					{item.subMenu.length} Menu
				</span>
			{/if}
		</div>

		<!-- snippet rekursif untuk merender sub menu   -->
		{#snippet nestedMenu(menuItems: any, level = 1)}
			<div class="grid grid-cols-1 gap-2.5 {level === 1 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}">
				{#each menuItems as sub (sub.id)}
					<!-- kondisi 1: jika menu memiliki cabang anak (cth: prestasi akademik -> semester) -->
					{#if sub.subMenu && sub.subMenu.length > 0}
						<div class="col-span-1 flex flex-col {level === 1 ? 'sm:col-span-2' : ''}">
							<button
								onclick={(e) => {
									e.preventDefault();
									toggleNested(sub.id);
								}}
								class="group {activeNestedId === sub.id
									? 'bg-scitech-navy/80 border-scitech-mint/40'
									: 'bg-scitech-navy/60 border-white/5'} hover:bg-scitech-slate-hover hover:border-scitech-mint/40 flex w-full items-center justify-between rounded-xl border p-3 transition-all duration-200"
							>
								<span
									class="group-hover:text-scitech-mint text-xs font-medium text-text-main transition-colors"
								>
									{sub.label}
								</span>
								<ChevronDown
									class="group-hover:text-scitech-mint h-4 w-4 shrink-0 text-text-main/40 transition-all duration-300 {activeNestedId ===
									sub.id
										? 'text-scitech-mint rotate-180'
										: ''}"
								/>
							</button>

							<!-- Render Child Level Selanjutnya secara Rekursif -->
							{#if activeNestedId === sub.id}
								<div
									transition:slide={{ duration: 250 }}
									class="border-scitech-mint/20 mt-2.5 ml-3 flex flex-col gap-2 border-l-2 pl-3"
								>
									{@render nestedMenu(sub.subMenu, level + 1)}
								</div>
							{/if}
						</div>

						<!-- kondisi 2: jika menu adalah tautan biasa tanpa cabang -->
					{:else}
						<a
							href={sub.href}
							class="group bg-scitech-navy/60 hover:bg-scitech-slate-hover hover:border-scitech-mint/40 flex items-center justify-between rounded-xl border border-white/5 p-3 transition-all duration-200"
						>
							<span
								class="group-hover:text-scitech-mint text-xs font-medium {level > 1
									? 'text-text-muted'
									: 'text-text-main'} transition-colors"
							>
								{sub.label}
							</span>
							<ChevronRight
								class="group-hover:text-scitech-mint h-4 w-4 shrink-0 text-text-main/40 transition-all group-hover:translate-x-1"
							/>
						</a>
					{/if}
				{/each}
			</div>
		{/snippet}

		<!-- Body Card: Panggil Snippet / Render Hasilnya -->
		{#if item.subMenu && item.subMenu.length > 0}
			{@render nestedMenu(item.subMenu, 1)}
		{:else}
			<!-- Tampilan saat Sub Menu kosong -->
			<div
				class="bg-scitech-navy/40 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-6 text-center"
			>
				<Layers class="mb-2 h-8 w-8 text-text-main/30" />
				<p class="text-xs font-medium text-text-main">Belum ada sub-menu</p>
				<span class="mt-0.5 text-[10px] text-text-main/50">Halaman sedang disiapkan</span>
			</div>
		{/if}
	</div>
{/if}
