<script lang="ts">
	import { ArrowUpRight, BookOpen, GraduationCap } from 'lucide-svelte';
</script>

<!-- Floating Minimalist Quick Access Bar -->
<div
	class="bg-scitech-navy/50 flex w-3/4 flex-col gap-2 rounded-2xl border border-white/10 p-2 shadow-2xl backdrop-blur-xl sm:w-fit sm:flex-row sm:items-center sm:p-1.5"
>
	<a
		href="#main"
		class="bg-scitech-mint text-scitech-navy shadow-scitech-mint/10 hover:bg-scitech-mint-hover inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-md transition-all active:scale-95 sm:w-auto sm:py-2"
	>
		<span>Get Started</span>
		<ArrowUpRight class="h-3.5 w-3.5" />
	</a>

	<div class="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
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
	</div>
</div>
