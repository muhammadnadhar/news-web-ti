<script lang="ts">
	import FormAngkatan from '../../_component/formAngkatan.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Edit Angkatan {data.angkatan.year} | Admin SciTech</title>
</svelte:head>

<FormAngkatan title={`Edit Angkatan (${data.angkatan.year})`} initialData={data.angkatan} {form} />
