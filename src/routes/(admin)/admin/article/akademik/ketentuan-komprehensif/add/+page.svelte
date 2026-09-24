<script lang="ts">
	import FormKetentuanKompre from '../_component/formKetentuanKompre.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-black text-text-main md:text-3xl">Tambah Rekrutmen Asisten Baru</h1>

	<FormKetentuanKompre action="?/create" initialData={form?.values} isEdit={false} />
</div>
