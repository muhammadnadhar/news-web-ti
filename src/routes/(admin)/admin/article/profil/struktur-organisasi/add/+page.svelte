<script lang="ts">
	import FormStructurOrg from '../component/formStructurOrg.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<FormStructurOrg

isEdit={false} actionUrl="?/create" {form} />
