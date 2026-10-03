<script lang="ts">
	import FormDaftarKerjasama from '../../_component/formDaftarKerjasama.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Edit Kerjasama - Admin Portal</title>
</svelte:head>

<div class="min-h-screen bg-bg-primary p-4 text-text-main md:p-8">
	<FormDaftarKerjasama
		initialData={data.kerjasama}
		valueData={form?.values}
		actionUrl="?/update"
		backUrl="/admin/article/kerjasama/daftar-kerjasama/"
	/>
</div>
