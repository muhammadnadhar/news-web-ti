<script lang="ts">
	import FormMshIpk from '../_component/FormMshIpk.svelte';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();
</script>

<FormMshIpk
	{form}
	angkatanList={data.angkatanList}
	semesterList={data.semesterList}
	isEdit={false}
/>
