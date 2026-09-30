<script lang="ts">
	import FormPedomanKkp from '../../_component/formPedomanKkp.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<FormPedomanKkp actionUrl="?/update" initialData={data.pedomanKkp} {form} />
