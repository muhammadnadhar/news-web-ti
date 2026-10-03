<script lang="ts">
	import FormProfilProdi from '../_components/formProfilProdi.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<FormProfilProdi isEdit={false} actionUrl="?/create" valuesData={form?.values} />
