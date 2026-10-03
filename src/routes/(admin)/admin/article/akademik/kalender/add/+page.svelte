<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import FormKalenderItem from '../_component/formKalenderItem.svelte';
	import { goto } from '$app/navigation';
	import { mergeNewPath } from '$lib/utils.js';

	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<div class="flex items-center justify-between border-b border-border-color/10 pb-6">
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
			Buat Kalender Akademik Baru
		</h1>
	</div>

	<!-- Form Input Kalender Baru -->
	<FormKalenderItem
		action="?/create"
		valuesData={form?.values}
		submitLabel="Simpan Kalender Baru"
		isBack={true}
		calendar={{
			id: '',
			title: '',
			description: '',
			is_active: true,
			images: []
		}}
	/>
</div>
