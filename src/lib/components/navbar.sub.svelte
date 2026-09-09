<script lang="ts">
	import { type MenuItem } from '$lib/types/navbar';
	import { ChevronRight, Layers } from 'lucide-svelte';

	interface Props {
		item: MenuItem;
	}

	let { item }: Props = $props();
</script>

{#if item}
	<div
		class="bg-scitech-slate hover:border-scitech-mint/30 w-full rounded-2xl border border-white/10 p-5 shadow-xl transition-all duration-300"
	>
		<!-- Header Card -->
		<div class="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
			<div class="flex items-center gap-3">
				<!-- Icon dengan Background khusus dari MenuItem -->
				<div
					class="flex shrink-0 items-center justify-center rounded-xl p-2.5 {item.bgClass ?? ''}"
				>
					<item.icon class="h-5 w-5" />
				</div>
				<div>
					<h3 class="text-base font-bold tracking-wide text-white">{item.label}</h3>
					<p class="text-[11px] text-text-muted">Navigasi Halaman</p>
				</div>
			</div>

			<!-- Indicator Jumlah Sub Menu -->
			{#if item.subMenu.length > 0}
				<span
					class="bg-scitech-mint-dim text-scitech-mint border-scitech-mint/20 rounded-full border px-2.5 py-1 text-[10px] font-semibold"
				>
					{item.subMenu.length} Menu
				</span>
			{/if}
		</div>

		<!-- Body Card: Daftar Sub Menu -->
		{#if item.subMenu.length > 0}
			<div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
				{#each item.subMenu as sub (sub.id)}
					<a
						href={sub.href}
						class="group bg-scitech-navy/60 hover:bg-scitech-slate-hover hover:border-scitech-mint/40 flex items-center justify-between rounded-xl border border-white/5 p-3 transition-all duration-200"
					>
						<span
							class="group-hover:text-scitech-mint text-xs font-medium text-text-main transition-colors"
						>
							{sub.label}
						</span>
						<ChevronRight
							class="group-hover:text-scitech-mint h-4 w-4 shrink-0 text-text-main/40 transition-all group-hover:translate-x-1"
						/>
					</a>
				{/each}
			</div>
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
