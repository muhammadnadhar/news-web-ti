<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import FormBeasiswa from '../../_component/formBeasiswa.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="container">
	<h1>Edit Data Beasiswa</h1>

	<FormBeasiswa initialData={data.scholarship} {form} action="?/update" />
</div>
