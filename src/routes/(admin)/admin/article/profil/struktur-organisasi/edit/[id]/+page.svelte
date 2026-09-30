<script lang="ts">
	import type { PageData, ActionData } from './$types';
import FormStructurOrg from '../../component/formStructurOrg.svelte';
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<FormStructurOrg

isEdit={true} actionUrl="?/update" initialData={data.item} {form} />
