<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';
	import { removeLastPath } from '$lib/utils';
	import FormAngkatan from '../_component/formAngkatan.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<FormAngkatan title="Tambah Angkatan Baru" {form} />
