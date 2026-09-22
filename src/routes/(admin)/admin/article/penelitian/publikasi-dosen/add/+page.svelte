<script lang="ts">
	import FormLecturerPublication from '../_component/formLecturerPublication.svelte';
	import type { ActionData, PageServerLoad } from './$types';

	let { data, form }: { form: ActionData; data: PageServerLoad } = $props();
</script>

<svelte:head>
	<title>Tambah Publikasi Dosen | Admin SciTech</title>
</svelte:head>

<FormLecturerPublication
	{form}
	lecturers={data.lecturers}
	initialData={data.initialData}
	isEdit={Boolean(data.initialData?.id)}
/>
