<script lang="ts">
	interface Props {
		count?: number;
	}

	// Svelte 5 Runes
	let { count = 8 }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
	{#each Array(count) as _}
		<div
			class="skeleton-card bg-scitech-navy-glare border-scitech-slate/40 relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-5 shadow-sm"
		>
			<div class="skeleton-splash"></div>

			<div class="flex items-center justify-between">
				<div class="bg-scitech-slate/50 h-10 w-10 rounded-xl"></div>
				<div class="bg-scitech-slate/30 h-5 w-16 rounded-full"></div>
			</div>

			<!-- Skeleton Body: Main Content / Image Preview -->
			<div class="bg-scitech-slate/40 h-28 w-full rounded-xl"></div>

			<!-- Skeleton Text Info -->
			<div class="mt-1 space-y-2">
				<div class="bg-scitech-slate/60 h-4 w-3/4 rounded-md"></div>
				<div class="bg-scitech-slate/30 h-3 w-1/2 rounded-md"></div>
			</div>

			<!-- Skeleton Footer: Action Button / Status -->
			<div class="border-scitech-slate/20 mt-auto flex items-center justify-between border-t pt-3">
				<div class="bg-scitech-slate/30 h-3 w-1/3 rounded-md"></div>
				<div class="bg-scitech-slate/40 h-7 w-20 rounded-lg"></div>
			</div>
		</div>
	{/each}
</div>

<style>
	/* Animation Keyframe: Bergerak dari Kiri Atas (-100%, -100%) ke Kanan Bawah (100%, 100%) */
	@keyframes diagonalSplash {
		0% {
			transform: translate(-100%, -100%);
		}
		100% {
			transform: translate(100%, 100%);
		}
	}

	/* Layer Splash/Shimmer Diagonal */
	.skeleton-splash {
		position: absolute;
		inset: 0;
		width: 200%;
		height: 200%;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0) 40%,
			rgba(255, 255, 255, 0.08) 50%,
			rgba(255, 255, 255, 0) 60%,
			rgba(255, 255, 255, 0) 100%
		);
		animation: diagonalSplash 2s infinite ease-in-out;
		pointer-events: none;
	}
</style>
