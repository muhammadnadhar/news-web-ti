<script lang="ts">
	import {
		ArrowUpRight,
		BookOpen,
		GraduationCap,
		PauseIcon,
		PlayIcon,
		Sparkles
	} from 'lucide-svelte';

	interface Props {
		isPlaying?: boolean;
		onToggleAnimation?: () => void;
		currentText: string;
	}

	let { isPlaying = true, currentText, onToggleAnimation }: Props = $props();

	let characters = $derived(Array.from(currentText));
</script>

<div class="flex flex-col gap-6">
	<div class="min-h-32.41 flex max-w-2xl items-end sm:min-h-[160px]">
		{#key currentText}
			<div class="animate-text-flip flex transform-gpu flex-col items-start">
				<h2
					class="text-3xl leading-tight font-black tracking-tight text-white sm:text-5xl md:text-6xl"
				>
					<span
						class="to-scitech-mint/80 bg-gradient-to-r from-white via-slate-100 bg-clip-text text-transparent"
					>
						"{#each characters as char, index}
							<span
								class="animate-char inline-block opacity-0"
								style="animation-delay: {index * 0.035}s;"
							>
								{char === ' ' ? ' ' : char}
							</span>
						{/each}"
					</span>
				</h2>
			</div>
		{/key}
	</div>

	<!-- FLOATING QUICK ACCESS BAR (BLUR LANGSUNG AKTIF TANPA DELAY) -->
	<div
		class="bg-scitech-navy/60 flex w-full max-w-xl transform-gpu flex-col gap-2 rounded-2xl border border-white/10 p-2 shadow-2xl backdrop-blur-2xl sm:w-fit sm:flex-row sm:items-center sm:p-1.5"
	>
		<a
			href="#main"
			class="bg-scitech-mint text-scitech-navy shadow-scitech-mint/10 hover:bg-scitech-mint-hover inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-md transition-all active:scale-95 sm:w-auto sm:py-2"
		>
			<span>Get Started</span>
			<ArrowUpRight class="h-3.5 w-3.5" />
		</a>

		<div class="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-2">
			<a
				href="https://uinarraniry.siakadcloud.com/"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-white/10 active:scale-95 sm:w-auto sm:px-3.5"
			>
				<BookOpen class="text-scitech-cyan h-3.5 w-3.5 shrink-0" />
				<span class="truncate">Portal SIAKAD</span>
			</a>

			<a
				href="/pmb"
				class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-white/10 active:scale-95 sm:w-auto sm:px-3.5"
			>
				<GraduationCap class="text-scitech-purple h-3.5 w-3.5 shrink-0" />
				<span class="truncate">Daftar PMB</span>
			</a>

			<!-- TOMBOL PLAY / PAUSE ANIMASI HERO -->
			<button
				type="button"
				onclick={onToggleAnimation}
				title={isPlaying ? 'Hentikan Animasi' : 'Jalankan Animasi'}
				aria-label={isPlaying ? 'Hentikan Animasi' : 'Jalankan Animasi'}
				class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-white/10 active:scale-95 sm:w-auto sm:px-3.5"
			>
				{#if isPlaying}
					<PauseIcon class="text-scitech-mint h-3.5 w-3.5 shrink-0" />
					<span class="truncate">Pause Slide</span>
				{:else}
					<PlayIcon class="text-scitech-mint h-3.5 w-3.5 shrink-0" />
					<span class="truncate">Play Slide</span>
				{/if}
			</button>
		</div>
	</div>
</div>
