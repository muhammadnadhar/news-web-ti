<script lang="ts">
	import FormDosenStaff from '../../_component/formDosenStaff.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form?: ActionData } = $props();
</script>

<svelte:head>
	<title>Edit Dosen & Staff - Admin Portal</title>
</svelte:head>

<div class="text-text-mai min-h-screen bg-bg-primary p-4 md:p-8">
	<div class="mx-auto max-w-4xl space-y-6">
		<FormDosenStaff
			valuesData={form?.values}
			isEdit={true}
			actionUrl="?/update"
			initialData={data.initialData}
		/>
	</div>
</div>
