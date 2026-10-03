<script lang="ts">
	import FormFasilitas from '../_component/formFasilitas.svelte';

	let { form, data } = $props();
</script>

<svelte:head>
	<title>Tambah Fasilitas | Admin</title>
</svelte:head>

<FormFasilitas
	valuesData={form?.values}
	onCancel={() => history.back()}
	isEditing={false}
	actionUrl="?/create"
/>
