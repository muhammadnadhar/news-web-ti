<script lang="ts">
	import FormGuideline from '../_component/FormGuideline.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Tambah Pedoman TA | Admin SciTech</title>
</svelte:head>

<FormGuideline {form} action="?/create" />
