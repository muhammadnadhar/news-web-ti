<!-- src/routes/admin/prestasi/[id]/edit/+page.svelte -->
<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import FormMhsPrestasi from '../../_component/formMhsPrestasi.svelte';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Jika form belum di-submit (masih null/undefined),
	// gunakan data awal dari `data.prestasi`
	let activeFormState = $derived(
		form ?? {
			values: data.prestasi
		}
	);
</script>

<svelte:head>
	<title>Edit Prestasi - {data.prestasi.studentName}</title>
</svelte:head>

<FormMhsPrestasi
	form={activeFormState}
	initData={data.prestasi}
	action="?/update"
	title="Edit Prestasi Mahasiswa"
	subtitle="Perbarui data prestasi mahasiswa di bawah ini."
	submitLabel="Simpan Perubahan"
	angkatanList={data.angkatanList}
	semesterList={data.semesterList}
/>
