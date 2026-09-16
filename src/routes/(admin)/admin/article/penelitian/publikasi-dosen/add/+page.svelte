<script lang="ts">
	import FormLecturerPublication from '../_component/formLecturerPublication.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Tambah Publikasi Dosen | Admin SciTech</title>
</svelte:head>

<FormLecturerPublication {form} />
