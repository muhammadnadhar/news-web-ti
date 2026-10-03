<script lang="ts">
	import FormModulePratikum from '../_component/formModulePratikum.svelte';

	let { form } = $props();
</script>

<FormModulePratikum
	action="?/create"
	isEditMode={false}
	valuesData={form?.values}
	submitLabel="Tambah Modul Baru"
/>
