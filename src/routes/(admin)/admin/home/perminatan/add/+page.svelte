<script lang="ts">
	import FormPeminatan from '../_component/formPeminatan.svelte';

	let { form } = $props();
</script>

<FormPeminatan valuesData={form?.values} action="?/create" />
