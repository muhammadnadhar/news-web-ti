<script lang="ts">
	import { fly, fade } from 'svelte/transition';

	// Data ikon vektor garis (Komputer -> Orang -> Robot) & Label Teks
	const items = [
		{ id: 'person', label: 'Kamu' },
		{ id: 'computer', label: 'Build' },
		{ id: 'robot', label: 'AI' }
	];

	let currentIndex = $state(0);

	$effect(() => {
		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % items.length;
		}, 2000);

		return () => clearInterval(interval);
	});
</script>

<div class="flex flex-col items-center justify-center p-8">
	<!-- container svg vector line drawing -->
	<div class="relative flex h-20 w-20 items-center justify-center">
		{#key currentIndex}
			<svg
				class="absolute h-16 w-16 text-text-main"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				out:fade={{ duration: 250 }}
			>
				{#if items[currentIndex].id === 'computer'}
					<!-- 1. VEKTOR KOMPUTER -->
					<rect
						x="2"
						y="3"
						width="20"
						height="14"
						rx="2"
						pathLength="1"
						class="draw-path"
						style="--delay: 0ms; --duration: 700ms;"
					/>
					<line
						x1="12"
						y1="17"
						x2="12"
						y2="21"
						pathLength="1"
						class="draw-path"
						style="--delay: 500ms; --duration: 300ms;"
					/>
					<line
						x1="8"
						y1="21"
						x2="16"
						y2="21"
						pathLength="1"
						class="draw-path"
						style="--delay: 700ms; --duration: 400ms;"
					/>
				{:else if items[currentIndex].id === 'person'}
					<!--  VEKTOR ORANG / MANUSIA -->
					<circle
						cx="12"
						cy="7"
						r="4"
						pathLength="1"
						class="draw-path"
						style="--delay: 0ms; --duration: 700ms;"
					/>
					<path
						d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
						pathLength="1"
						class="draw-path"
						style="--delay: 500ms; --duration: 800ms;"
					/>
				{:else if items[currentIndex].id === 'robot'}
					<!-- VEKTOR ROBOT -->
					<circle
						cx="12"
						cy="3"
						r="1"
						pathLength="1"
						class="draw-path"
						style="--delay: 0ms; --duration: 300ms;"
					/>
					<line
						x1="12"
						y1="4"
						x2="12"
						y2="7"
						pathLength="1"
						class="draw-path"
						style="--delay: 200ms; --duration: 300ms;"
					/>
					<rect
						x="5"
						y="7"
						width="14"
						height="12"
						rx="2"
						pathLength="1"
						class="draw-path"
						style="--delay: 400ms; --duration: 600ms;"
					/>
					<line
						x1="9"
						y1="11"
						x2="9.01"
						y2="11"
						stroke-width="2"
						pathLength="1"
						class="draw-path"
						style="--delay: 900ms; --duration: 200ms;"
					/>
					<line
						x1="15"
						y1="11"
						x2="15.01"
						y2="11"
						stroke-width="2"
						pathLength="1"
						class="draw-path"
						style="--delay: 900ms; --duration: 200ms;"
					/>
					<line
						x1="9"
						y1="15"
						x2="15"
						y2="15"
						pathLength="1"
						class="draw-path"
						style="--delay: 1000ms; --duration: 400ms;"
					/>
				{/if}
			</svg>
		{/key}
	</div>

	<!-- TEXT TRANSITION -->
	<div class="relative mt-3 h-6 overflow-hidden text-center">
		{#key currentIndex}
			<p
				in:fly={{ y: 14, duration: 400, delay: 250 }}
				out:fly={{ y: -14, duration: 300 }}
				class="text-sm font-medium tracking-wide text-text-muted"
			>
				{items[currentIndex].label}
			</p>
		{/key}
	</div>
</div>

<style>
	.draw-path {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: lineDrawAnimation var(--duration, 600ms) cubic-bezier(0.65, 0, 0.35, 1)
			var(--delay, 0ms) forwards;
	}

	@keyframes lineDrawAnimation {
		from {
			stroke-dashoffset: 1;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
