<script lang="ts">
	import FormKetentuanKompre from '../../_component/formKetentuanKompre.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Gunakan data dari form jika ada error submit, atau data asli dari server
	const valuesData = form?.values;
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-black text-text-main md:text-3xl">Ubah Rekrutmen Asisten</h1>

	<FormKetentuanKompre
		action="?/update"
		initialData={data.ketentuan}
		{valuesData}
		isEdit={true}
		submitButtonText="Perbarui Rekrutmen"
	/>
</div>
