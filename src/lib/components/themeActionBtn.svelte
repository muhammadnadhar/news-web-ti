<script lang="ts">
	import { Apptheme } from '$lib/global/theme';
	import { Moon, Sun } from 'lucide-svelte';

	interface Props {
		onlyIcon?: boolean;
	}

	// Default value set ke `false` agar prop bersifat opsional
	let { onlyIcon = false }: Props = $props();
</script>

<button
	type="button"
	onclick={() => Apptheme.toggle()}
	title={$Apptheme === 'dark' ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
	aria-label={$Apptheme === 'dark' ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
	class="dark:bg-scitech-navy dark:text-scitech-cyan flex shrink-0 items-center justify-center gap-2 rounded-xl border border-black/10 bg-slate-100 p-2 text-slate-700 transition-all hover:bg-slate-200 active:scale-95 dark:border-white/10 dark:hover:bg-white/10 {onlyIcon
		? ''
		: 'sm:px-3 sm:py-2'}"
>
	{#if $Apptheme === 'dark'}
		<Sun class="h-4 w-4 shrink-0 text-amber-400 transition-transform hover:rotate-45" />
		{#if !onlyIcon}
			<span class="hidden font-mono text-xs whitespace-nowrap md:inline">Light Mode</span>
		{/if}
	{:else}
		<Moon class="h-4 w-4 shrink-0 text-indigo-600 transition-transform hover:-rotate-12" />
		{#if !onlyIcon}
			<span class="hidden font-mono text-xs whitespace-nowrap md:inline">Dark Mode</span>
		{/if}
	{/if}
</button>
