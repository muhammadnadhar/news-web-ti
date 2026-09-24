<script lang="ts">
	import FormModulePratikum from '../../_component/formModulePratikum.svelte';

	let { data } = $props();
</script>

<FormModulePratikum
	action="?/update"
	initialData={data.module}
	isEditMode={true}
	submitLabel="Simpan Perubahan Modul"
/>
