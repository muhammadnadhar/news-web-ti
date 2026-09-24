<script lang="ts">
	import FormGuideline from '../../_component/FormGuideline.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Edit Pedoman TA | Admin SciTech</title>
</svelte:head>

<FormGuideline action="?/update" initialData={data.pedomanTa} isEdit={true} {form} />
