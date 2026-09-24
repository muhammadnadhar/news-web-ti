<script lang="ts">
	import type { ActionData } from './$types';
	import FormBeasiswa from '../_component/formBeasiswa.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<div class="container">
	<h1>Tambah Data Beasiswa</h1>

	<!-- Cukup panggil komponen tanpa initialData -->
	<FormBeasiswa {form} action="?/create" />
</div>
