<script lang="ts">
	import FormPedomanKkp from '../_component/formPedomanKkp.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<FormPedomanKkp actionUrl="?/create" {form} />
