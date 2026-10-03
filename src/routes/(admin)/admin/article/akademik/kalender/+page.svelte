<script lang="ts">
	import { Loader2, Plus } from 'lucide-svelte';
	import FormKalenderItem from './_component/formKalenderItem.svelte';
	import { goto } from '$app/navigation';
	import { mergeNewPath } from '$lib/utils.js';
	import Spin from '$lib/components/loading/spin.svelte';

	import type { ActionData, PageServerLoad } from './$types';

	let { form, data }: { form: ActionData; data: PageServerLoad } = $props();

	// Mengambil array daftar kalender dari server
	let calendarList = $derived(form?.values ?? data.calendars ?? []);

	function handleDelete(id: string) {
		if (confirm('Apakah Anda yakin ingin menghapus kalender ini?')) {
			const form = document.createElement('form');
			form.method = 'POST';
			form.action = '?/delete';
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = 'id';
			input.value = id;
			form.appendChild(input);
			document.body.appendChild(form);
			form.submit();
		}
	}
</script>

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<div
		class="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
				Daftar Kalender Akademik
			</h1>
		</div>

		<button
			type="button"
			onclick={() => goto(mergeNewPath('add'))}
			class="text-scitech-navy inline-flex items-center gap-2 rounded-xl bg-bg-secondary px-5 py-2.5 text-xs font-bold shadow-lg transition-all hover:bg-bg-secondary-hover active:scale-95"
		>
			<Plus class="h-4 w-4" />
			<span>Tambah Kalender</span>
		</button>
	</div>

	<!-- looping form (dengan penanganan promise {#await}) -->
	<div class="space-y-8">
		{#await calendarList}
			<Spin />
		{:then rawdata}
			<!-- normalisasi: ubah single object / array / null menjadi bentuk array yang konsisten -->
			{@const calendarList = Array.isArray(rawdata) ? rawdata : rawdata ? [rawdata] : []}

			{#if calendarList.length === 0}
				<div
					class="rounded-2xl border border-white/10 bg-bg-secondary/40 p-8 text-center text-xs text-text-muted"
				>
					Belum ada data kalender akademik. Klik tombol
					<strong class="text-scitech-mint">"Tambah Kalender"</strong> di atas.
				</div>
			{:else}
				{#each calendarList as item (item.id)}
					<FormKalenderItem
						valuesData={form?.values}
						calendar={item}
						onDelete={handleDelete}
						isBtnActive={true}
					/>
				{/each}
			{/if}
		{:catch error}
			<!-- state error jika promise reject -->
			<div
				class="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs text-rose-400"
			>
				Gagal memuat data kalender: {error.message}
			</div>
		{/await}
	</div>
</div>
