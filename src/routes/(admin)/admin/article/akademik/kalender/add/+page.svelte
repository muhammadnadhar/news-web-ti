<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import FormKalenderItem from '../_component/formKalenderItem.svelte';
	import { goto } from '$app/navigation';
	import { mergeNewPath } from '$lib/utils.js';
</script>

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<div class="flex items-center justify-between border-b border-white/10 pb-6">
		<div>
			<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
				Buat Kalender Akademik Baru
			</h1>
		</div>

		<button
			type="button"
			onclick={() => goto(mergeNewPath('..'))}
			class="bg-scitech-navy hover:bg-scitech-navy/80 inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-medium text-text-muted transition-all hover:text-text-main"
		>
			<ArrowLeft class="h-4 w-4" />
			<span>Kembali ke Daftar</span>
		</button>
	</div>

	<!-- Form Input Kalender Baru -->
	<FormKalenderItem
		action="?/create"
		submitLabel="Simpan Kalender Baru"
		calendar={{
			id: '',
			title: '',
			description: '',
			is_active: true,
			images: []
		}}
	/>
</div>
