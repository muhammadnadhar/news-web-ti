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
	onclick={(e) => Apptheme.toggle(e)}
	title={$Apptheme === 'dark' ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
	aria-label={$Apptheme === 'dark' ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
	class="flex shrink-0 items-center justify-center gap-2 rounded-xl border  bg-text-main p-2 text-bg-primary transition-all hover:bg-text-muted active:scale-95 border-border-color  {onlyIcon
		? ''
		: 'sm:px-3 sm:py-2'}"
>
	{#if $Apptheme === 'dark'}
		<Sun class="h-4 w-4 shrink-0 text-accent-yellow transition-transform hover:rotate-45" />
		{#if !onlyIcon}
			<span class="hidden font-mono text-xs whitespace-nowrap md:inline">Light Mode</span>
		{/if}
	{:else}
		<Moon class="h-4 w-4 shrink-0 text-accent-blue transition-transform hover:-rotate-12" />
		{#if !onlyIcon}
			<span class="hidden font-mono text-xs whitespace-nowrap md:inline">Dark Mode</span>
		{/if}
	{/if}
</button>
