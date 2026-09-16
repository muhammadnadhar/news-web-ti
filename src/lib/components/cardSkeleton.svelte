
<script lang="ts">
	interface Props {
		itemsCount?: number; // Jumlah kartu yang ingin ditampilkan (default: 3)
	}

	// Svelte 5 Runes syntax
	let { itemsCount = 1 }: Props = $props();
</script>

<!-- Grid Wrapper untuk menampung deretan Card -->
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 w-full p-1">
	{#each Array(itemsCount) as _, index}
		<div
			class="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-scitech-slate/50 p-4 shadow-xl backdrop-blur-xl"
		>
			<!-- Efek Shimmer Wave (Kilauan Menyapu) -->
			<div class="shimmer-wave"></div>

			<div class="h-44 w-full animate-pulse rounded-xl bg-text-muted/20"></div>

			<div class="mt-4 flex items-start gap-3">
				<div class="h-9 w-9 shrink-0 animate-pulse rounded-full bg-text-muted/20"></div>

				<div class="flex-1 space-y-2">
					<div class="h-4 w-3/4 animate-pulse rounded bg-text-main/30"></div>
					<div class="h-3 w-1/3 animate-pulse rounded bg-text-muted/20"></div>
				</div>
			</div>

			<div class="mt-4 space-y-2">
				<div class="h-3 w-full animate-pulse rounded bg-text-muted/15"></div>
				<div class="h-3 w-full animate-pulse rounded bg-text-muted/15"></div>
				<div class="h-3 w-4/5 animate-pulse rounded bg-text-muted/15"></div>
			</div>

			<div class="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
				<div class="h-3.5 w-16 animate-pulse rounded bg-text-muted/20"></div>
				
				<div class="h-7 w-20 animate-pulse rounded-lg bg-scitech-mint/20"></div>
			</div>
		</div>
	{/each}
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
		animation: shimmer 2.2s infinite linear;
	}
</style>
