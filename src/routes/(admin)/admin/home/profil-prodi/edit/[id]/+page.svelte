<script lang="ts">
	import FormProfilProdi from '../../_components/formProfilProdi.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<FormProfilProdi
	isEdit={true}
	actionUrl="?/update"
	initialData={data.item}
	valuesData={form?.values}
/>
