<script lang="ts">
	import { Loader2, Plus } from 'lucide-svelte';
	import FormKalenderItem from './_component/formKalenderItem.svelte';
	import { goto } from '$app/navigation';
	import { mergeNewPath } from '$lib/utils.js';

	let { data } = $props();

	// Mengambil array daftar kalender dari server
	let calendarList = $derived(data.calendars ?? []);

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

		<!-- Tombol Pindah ke Halaman Tambah Kalender -->
		<button
			type="button"
			onclick={() => goto(mergeNewPath('add'))}
			class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95"
		>
			<Plus class="h-4 w-4" />
			<span>Tambah Kalender</span>
		</button>
	</div>

	<!-- looping form (dengan penanganan promise {#await}) -->
	<div class="space-y-8">
		{#await calendarList}
			<div
				class="bg-scitech-slate/20 flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 p-12 text-center"
			>
				<Loader2 class="text-scitech-mint h-8 w-8 animate-spin" />
				<p class="text-xs text-text-muted">Memuat daftar kalender akademik...</p>
			</div>
		{:then rawdata}
			<!-- normalisasi: ubah single object / array / null menjadi bentuk array yang konsisten -->
			{@const calendarList = Array.isArray(rawdata) ? rawdata : rawdata ? [rawdata] : []}

			{#if calendarList.length === 0}
				<div
					class="bg-scitech-slate/40 rounded-2xl border border-white/10 p-8 text-center text-xs text-text-muted"
				>
					Belum ada data kalender akademik. Klik tombol
					<strong class="text-scitech-mint">"Tambah Kalender"</strong> di atas.
				</div>
			{:else}
				{#each calendarList as item (item.id)}
					<FormKalenderItem calendar={item} onDelete={handleDelete} isBtnActive={true} />
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
