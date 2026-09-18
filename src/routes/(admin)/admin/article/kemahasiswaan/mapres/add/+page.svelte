<script lang="ts">
	import FormMhsPrestasi from '../_component/formMhsPrestasi.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<FormMhsPrestasi {form} />
