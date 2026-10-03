<script lang="ts">
	import type { ActionData } from './$types';
	import FormSemester from '../_component/formSemester.svelte';
	let { form }: { form: ActionData } = $props();
</script>

<FormSemester valuesData={form?.values} isEdit={false} />
