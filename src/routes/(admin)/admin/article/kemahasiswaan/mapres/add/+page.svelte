<script lang="ts">
	import FormMhsPrestasi from '../_component/formMhsPrestasi.svelte';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();
</script>

<FormMhsPrestasi
	angkatanList={data.angkatanList}
	semesterList={data.semesterList}
	action="?/create"
	{form}
/>
