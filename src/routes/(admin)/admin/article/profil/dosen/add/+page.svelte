<script lang="ts">
	import FormDosenStaff from '../_component/formDosenStaff.svelte';
	import type { ActionData } from './$types';

	let { form }: { form?: ActionData } = $props();
</script>

<svelte:head>
	<title>Tambah Dosen & Staff - Admin Portal</title>
</svelte:head>

<div class="min-h-screen bg-[var(--color-bg-primary)] p-4 text-[var(--color-text-main)] md:p-8">
	<div class="mx-auto max-w-4xl space-y-6">
		<FormDosenStaff {form} isEdit={false} actionUrl="?/create" />
	</div>
</div>
