<script lang="ts">
	import FormJabatan from '../_component/formJabatan.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Tambah Jabatan Prodi - Admin Portal</title>
</svelte:head>

<div class="min-h-screen p-4 md:p-8">
	<FormJabatan title="Tambah Jabatan Prodi Baru" {form} />
</div>
