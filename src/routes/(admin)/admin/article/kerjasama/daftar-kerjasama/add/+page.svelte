<script lang="ts">
	import FormDaftarKerjasama from '../_component/formDaftarKerjasama.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Tambah Kerjasama - Admin Portal</title>
</svelte:head>

<div class="min-h-screen bg-bg-primary p-4 text-text-main md:p-8">
	<FormDaftarKerjasama {form} actionUrl="?/create" />
</div>
