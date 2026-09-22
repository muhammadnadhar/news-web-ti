<script lang="ts">
	import type { ActionData } from './$types';
	import FormCourceMap from '../_component/formCourceMap.svelte';
	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Tambah Peta Mata Kuliah | Admin</title>
</svelte:head>

<FormCourceMap
	curAction={'?/save'}
	initialData={form?.values}
	formError={form?.message}
	isEditMode={false}
	submitLabel="Simpan Peta MK"
/>
