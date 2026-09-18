<script lang="ts">
	import FormMshPublish from '../_component/formMshPublish.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Tambah Publikasi Mahasiswa | Admin SciTech</title>
</svelte:head>

<FormMshPublish {form} />
