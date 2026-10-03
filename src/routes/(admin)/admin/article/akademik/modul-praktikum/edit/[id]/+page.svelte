<script lang="ts">
	import FormModulePratikum from '../../_component/formModulePratikum.svelte';

	let { data, form } = $props();
</script>

<FormModulePratikum
	action="?/update"
	valuesData={form?.values ?? data.module}
	isEditMode={true}
	submitLabel="Simpan Perubahan Modul"
/>
