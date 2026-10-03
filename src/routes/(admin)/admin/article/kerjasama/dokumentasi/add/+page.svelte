<script lang="ts">
	import FormDocActivity from '../_component/formDocActivity.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Tambah Dokumentasi Kegiatan | Admin</title>
</svelte:head>

<FormDocActivity
	valuesData={form?.values}
	action="?/create"
	isEditMode={false}
	submitLabel="Simpan Dokumentasi"
/>
