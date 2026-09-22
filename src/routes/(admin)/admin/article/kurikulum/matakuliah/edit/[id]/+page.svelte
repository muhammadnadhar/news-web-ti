<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import FormCourceMap from '../../_component/formCourceMap.svelte';
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Edit Peta Mata Kuliah - {data.courseMap?.title || ''} | Admin</title>
</svelte:head>

<FormCourceMap
	curAction={'?/update'}
	initialData={form?.values ?? data.courseMap}
	formError={form?.message}
	isEditMode={true}
	submitLabel="Perbarui Peta MK"
/>
