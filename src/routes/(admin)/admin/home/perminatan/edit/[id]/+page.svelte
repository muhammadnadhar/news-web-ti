<script lang="ts">
	import FormPeminatan from '../../_component/formPeminatan.svelte';

	let { data, form } = $props();
</script>

<FormPeminatan
	isEdit={true}
	initialData={data.peminatan}
	valuesData={form?.values}
	action="?/update"
/>
