<script lang="ts">
	import FormLecturerPublication from '../../_component/formLecturerPublication.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Edit Publikasi Dosen | Admin SciTech</title>
</svelte:head>

<FormLecturerPublication
	lecturers={data.lecturers}
	initialData={data.lecturerPublication}
	isEdit={true}
	{form}
/>
