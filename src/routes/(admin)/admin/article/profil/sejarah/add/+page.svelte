<script lang="ts">
	import FormLeaderPriode from '../_component/formLeaderPriode.svelte';

	let { data, form } = $props();
</script>

<div class="space-y-6 p-6 lg:p-10">
	<div class="bg flex items-center justify-between pb-4">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Tambah Pimpinan Jurusan</h1>
	</div>

	<!-- wrapper form -->
	<div class="max-w-2xl border bg-bg-secondary p-3.5 shadow-xl">
		<FormLeaderPriode
			valuesData={form?.values}
			lecturers={data.lecturers}
			formError={form?.message}
			submitLabel="Simpan Data Pimpinan"
			onCancel={() => history.back()}
		/>
	</div>
</div>
