<script lang="ts">
	import FormMshIpk from '../../_component/FormMshIpk.svelte';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	$inspect(data);
</script>

<FormMshIpk
	{form}
	action={'?/update'}
	initialData={data.mhsipk}
	angkatanList={data.angkatanList}
	semesterList={data.semesterList}
	isEdit={true}
/>
