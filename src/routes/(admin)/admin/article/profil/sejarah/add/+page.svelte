<script lang="ts">
	import FormLeaderPriode from '../_component/formLeaderPriode.svelte';

	let { data, form } = $props();
</script>

<div class="space-y-6 p-6 lg:p-10">
	<div class="bg flex items-center justify-between pb-4">
		<h1 class="text-2xl font-bold text-text-main">Tambah Pimpinan Jurusan</h1>
	</div>

	<FormLeaderPriode
		valuesData={form?.values}
		lecturers={data.lecturers}
		formError={form?.message}
		submitLabel="Simpan Data Pimpinan"
		onCancel={() => history.back()}
	/>
</div>
