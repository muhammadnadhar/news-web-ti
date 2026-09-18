<script lang="ts">
	import type { JabatanProdiDTO } from '$lib/types/admin/dataset';
	import { Briefcase, ChevronDown } from 'lucide-svelte';

	interface Props {
		positions: JabatanProdiDTO[];
		selectedPosition: string;
		name?: string;
		required?: boolean;
	}

	let {
		positions,
		selectedPosition = $bindable(''),
		name = 'position',
		required = true
	}: Props = $props();
</script>

<div class="space-y-1.5">
	<label for={name} class="block text-xs font-medium text-[var(--color-text-muted)]">
		Jabatan Prodi <span class="text-[var(--color-status-error)]">*</span>
	</label>
	<div class="relative">
		<select
			id={name}
			{name}
			bind:value={selectedPosition}
			{required}
			class="w-full appearance-none rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] py-2.5 pr-10 pl-10 text-xs text-[var(--color-text-main)] transition-colors focus:border-[var(--color-accent-primary)] focus:outline-none"
		>
			<option value="" disabled selected>-- Pilih Jabatan Prodi --</option>
			{#each positions as pos (pos.id)}
				<option value={pos.name}>{pos.name}</option>
			{/each}
		</select>
		<Briefcase class="absolute top-3 left-3 h-4 w-4 text-[var(--color-text-muted)]" />
		<div
			class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--color-text-muted)]"
		>
			<ChevronDown class="h-4 w-4" />
		</div>
	</div>
</div>
