<script lang="ts">
	import FormJabatan from '../../_component/formJabatan.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Edit Jabatan Prodi - Admin Portal</title>
</svelte:head>

<div class="min-h-screen p-4 md:p-8">
	<FormJabatan title="Edit Jabatan Prodi" initialData={data.position} {form} />
</div>
