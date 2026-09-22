<script lang="ts">

	import FormAngkatan from '../_component/formAngkatan.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<FormAngkatan title="Tambah Angkatan Baru" {form} />
