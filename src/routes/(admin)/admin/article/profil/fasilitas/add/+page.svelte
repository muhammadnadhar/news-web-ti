<script lang="ts">
	import FormFasilitas from '../_component/formFasilitas.svelte';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form?: ActionData; data?: PageData } = $props();
</script>

<svelte:head>
	<title>Tambah Fasilitas | Admin</title>
</svelte:head>

<FormFasilitas
	valuesData={form?.values}
	onCancel={() => history.back()}
	isEditing={false}
  valuesData={form.?values}
	actionUrl="?/create"
/>
