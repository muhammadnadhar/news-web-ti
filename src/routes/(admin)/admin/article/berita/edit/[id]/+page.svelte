<script lang="ts">
	import FormNews from '../../_component/formNews.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<FormNews
	{form}
	valuesData={form?.values}
	initialData={data.berita}
	isEdit={true}
	actionUrl="?/update"
/>
