<script lang="ts">
	import type { ActionData } from './$types';
	import FormBeasiswa from '../_component/formBeasiswa.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<div class="container">
	<!-- Cukup panggil komponen tanpa initialData -->
	<FormBeasiswa valueData={form?.values} action="?/create" />
</div>
