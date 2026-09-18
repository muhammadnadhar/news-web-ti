<script lang="ts">
	import FormPeminatan from '../_component/formPeminatan.svelte';

	let { form } = $props();
</script>

<FormPeminatan {form} action="?/create" />
