<script lang="ts">
	import { UserCog, Plus, Search, ArrowUpDown, Edit3, Trash2 } from 'lucide-svelte';

	interface Props {
		showTitle?: boolean;
		title?: string;
		columnsCount?: number; // Menerima jumlah kolom, default 1
		rowCount?: number;     // Menerima jumlah baris loading, default 5
	}

	// Svelte 5 Runes syntax
	let { 
		showTitle = true, 
		title = 'Memuat Data Admin...', 
		columnsCount = 1, 
		rowCount = 5 
	}: Props = $props();
</script>

<div class="relative overflow-hidden rounded-2xl border border-white/10 bg-scitech-slate/50 p-5 shadow-2xl backdrop-blur-xl">
	
	<div class="pointer-events-none z-0 w-full select-none opacity-25">
		
		<!-- Fake Header Action Bar -->
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
			<div class="h-4 w-36 bg-text-muted/40 rounded animate-pulse"></div>
			<div class="h-8 w-28 bg-scitech-mint/30 rounded-xl animate-pulse"></div>
		</div>

		<!-- Fake Entries & Search -->
		<div class="flex flex-col gap-3 mt-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-2 animate-pulse">
				<div class="h-3 w-8 bg-text-muted/40 rounded"></div>
				<div class="h-7 w-12 bg-white/10 rounded-lg"></div>
				<div class="h-3 w-12 bg-text-muted/40 rounded"></div>
			</div>
			<div class="h-7 w-full sm:w-64 bg-white/10 rounded-lg animate-pulse"></div>
		</div>

		<!-- Fake Table Konten -->
		<div class="overflow-x-auto rounded-xl border border-white/10 bg-scitech-navy/60 mt-4">
			<table class="w-full border-collapse text-left text-xs">
				<!-- Fake Thead -->
				<thead>
					<tr class="border-b border-white/10 bg-white/5 uppercase">
						{#each Array(columnsCount) as _}
							<th class="p-3.5">
								<div class="flex items-center gap-1.5 opacity-40">
									<div class="h-3 w-16 bg-text-muted rounded animate-pulse"></div>
									<ArrowUpDown class="h-3 w-3 text-scitech-cyan/70" />
								</div>
							</th>
						{/each}
						<th class="p-3.5 text-center w-28 opacity-40">Menu</th>
					</tr>
				</thead>

				<!-- Fake Tbody Rows -->
				<tbody class="divide-y divide-white/5">
					{#each Array(rowCount) as _, rowIndex}
						<tr class="bg-white/[0.01]">
							{#each Array(columnsCount) as _, colIndex}
								<td class="p-3.5 align-middle">
									<!-- Variasi tinggi/lebar antar baris agar terlihat natural -->
									<div 
										class="h-3.5 bg-text-muted/30 rounded animate-pulse"
										style="width: {rowIndex % 2 === 0 ? '75%' : '55%'}"
									></div>
								</td>
							{/each}
							<!-- Fake Menu Actions (Edit & Delete) -->
							<td class="p-3.5 align-middle">
								<div class="flex items-center justify-center gap-2 opacity-30">
									<div class="h-7 w-7 rounded-lg bg-scitech-cyan/40 animate-pulse"></div>
									<div class="h-7 w-7 rounded-lg bg-red-500/40 animate-pulse"></div>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<div class="shimmer-wave"></div>

	<div class="absolute inset-0 z-10 flex items-center justify-center p-4">
		<div
			class="bg-scitech-slate/80 border-scitech-slate/50 flex max-w-[280px] flex-col items-center justify-center gap-4 rounded-2xl border px-8 py-6 text-center shadow-2xl backdrop-blur-md"
		>
			<!-- Icon Centered -->
			<div
				class="animate-bounce rounded-xl bg-bg-secondary/20 p-3 text-text-muted"
				style="animation-duration: 2s;"
			>
				<UserCog class="h-8 w-8 text-scitech-mint" />
			</div>

			<!-- Text Below Icon -->
			{#if showTitle}
				<div class="space-y-1">
					<h3 class="text-xs font-semibold tracking-wide text-text-main">
						{title}
					</h3>
					<p class="text-[11px] text-text-muted opacity-70">Mohon tunggu sebentar</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Animasi Gelombang Kaca Diagonal (Kiri Atas -> Kanan Bawah) */
	@keyframes shimmer {
		0% {
			transform: translate(-100%, -100%);
		}
		100% {
			transform: translate(100%, 100%);
		}
	}

	.shimmer-wave {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.01) 30%,
			rgba(255, 255, 255, 0.06) 50%,
			rgba(255, 255, 255, 0.01) 70%,
			rgba(255, 255, 255, 0) 100%
		);
		animation: shimmer 2.5s infinite linear;
	}
</style>

