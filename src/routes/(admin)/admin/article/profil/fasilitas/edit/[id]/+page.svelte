<script lang="ts">
	import FormFasilitas from '../../_component/formFasilitas.svelte';

	let { data, form } = $props();

	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Edit Fasilitas - {data.facility.name}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<FormFasilitas
		initialData={data.facility}
		valuesData={form?.values}
		categories={data.categories}
		isEditing={true}
		actionUrl="?/update"
		{isSubmitting}
		onCancel={() => history.back()}
	/>
</div>
