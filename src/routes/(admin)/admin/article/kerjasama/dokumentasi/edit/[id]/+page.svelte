<script lang="ts">
	import FormDocActivity from '../../_component/formDocActivity.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Edit Dokumentasi - {data.documentation?.title || ''} | Admin</title>
</svelte:head>

<FormDocActivity
	initialData={form?.values ?? data.documentation}
	formError={form?.error}
	isEditMode={true}
	submitLabel="Perbarui Dokumentasi"
/>
