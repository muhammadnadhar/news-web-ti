<script lang="ts">
	import { AlertCircleIcon } from 'lucide-svelte';
	import type { Component } from 'svelte';

	interface Props {
		title?: string;
		description?: string;
		icon?: Component<{ class?: string }>;
	}

	let {
		title = 'Belum Ada Data',
		description = 'Data belum diunggah. Silakan cek kembali secara berkala.',
		icon: IconComponent = AlertCircleIcon
	}: Props = $props();
</script>

<div
	class="flex flex-col items-center justify-center border border-border-light bg-bg-secondary p-8 text-center shadow-sm sm:p-12"
>
	<!-- Container Icon -->
	<div
		class="mb-4 flex h-12 w-12 items-center justify-center border border-border-light bg-bg-primary text-accent-primary"
	>
		<IconComponent class="h-6 w-6" />
	</div>

	<!-- Judul (Props) -->
	<h3 class="text-base font-bold text-text-main sm:text-lg">
		{title}
	</h3>

	<!-- Deskripsi (Props) -->
	{#if description}
		<p class="mt-1 max-w-md text-xs text-text-muted sm:text-sm">
			{description}
		</p>
	{/if}
</div>
