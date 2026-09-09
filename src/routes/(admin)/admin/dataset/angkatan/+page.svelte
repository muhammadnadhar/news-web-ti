<script lang="ts">
	import { Users, Plus, Search, ArrowUpDown, Edit3, Trash2, Sparkles, X } from 'lucide-svelte';

	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';

	// Data Angkatan sesuai Gambar 2
	let angkatanList = $state<TableContentType[]>([
		{
			id: '1',
			items: [{ colomn: 'Nama', row: 'Angkatan 2019' }]
		},
		{
			id: '2',
			items: [{ colomn: 'Nama', row: 'Angkatan 2020' }]
		},
		{
			id: '3',
			items: [{ colomn: 'Nama', row: 'Angkatan 2021' }]
		},
		{
			id: '4',
			items: [{ colomn: 'Nama', row: 'Angkatan 2022' }]
		},
		{
			id: '5',
			items: [{ colomn: 'Nama', row: 'Angkatan 2023' }]
		}
	]);
	// State Management
	let searchQuery = $state('');
	let entriesPerPage = $state(10);
	let isAddModalOpen = $state(false);
	let newNama = $state('');

	// Derived Filtered Data

	// Filter list berdasarkan nilai di dalam array `items`
	let filteredList = $derived(
		angkatanList.filter((item) =>
			item.items.some((col) => String(col.row).toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	// Fungsi Tambah Data Angkatan
	function handleAddAngkatan(e: SubmitEvent) {
		e.preventDefault();
		if (!newNama) return;

		const newItem: TableContentType = {
			id: Date.now().toString(),
			items: [{ colomn: 'Nama', row: `Angkatan ${newNama}` }]
		};

		angkatanList = [...angkatanList, newItem];
		newNama = '';
		isAddModalOpen = false;
	}

	// Fungsi Hapus Data
	function handleDelete(target: TableContentType | string) {
		const targetId = typeof target === 'string' ? target : target.id;
		angkatanList = angkatanList.filter((item) => item.id !== targetId);
	}
</script>

<div class="mx-auto max-w-7xl space-y-8">
	<!-- Page Header -->
	<div class="border-b border-white/10 pb-6">
		<span
			class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
		>
			<Sparkles class="text-scitech-mint h-4 w-4" /> Dataset Akademik
		</span>
		<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Angkatan</h1>
	</div>

	<!-- Main Table Container Card -->
	<!-- <div -->
	<!-- 	class="bg-scitech-slate/60 space-y-6 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8" -->
	<!-- > -->
	<!-- 	<!-- Top Action Bar -->
	<!-- 	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"> -->
	<!-- 		<div class="flex items-center gap-3"> -->
	<!-- 			<div -->
	<!-- 				class="bg-scitech-mint/10 text-scitech-mint border-scitech-mint/20 rounded-2xl border p-2.5" -->
	<!-- 			> -->
	<!-- 				<Users class="h-5 w-5" /> -->
	<!-- 			</div> -->
	<!-- 			<div> -->
	<!-- 				<h2 class="text-base font-bold text-white sm:text-lg"> -->
	<!-- 					Data Angkatan Teknologi Informasi -->
	<!-- 				</h2> -->
	<!-- 				<p class="text-text-muted text-xs">Master data tahun kohort mahasiswa</p> -->
	<!-- 			</div> -->
	<!-- 		</div> -->
	<!---->
	<!-- 		<button -->
	<!-- 			onclick={() => (isAddModalOpen = true)} -->
	<!-- 			class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover shadow-scitech-mint/20 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all duration-200 active:scale-95 sm:text-sm" -->
	<!-- 		> -->
	<!-- 			<Plus class="h-4 w-4" /> -->
	<!-- 			<span>+ Angkatan</span> -->
	<!-- 		</button> -->
	<!-- 	</div> -->
	<!---->
	<!-- 	<!-- Controls Bar --> -->
	<!-- 	<div class="flex flex-col justify-between gap-4 pt-2 md:flex-row md:items-center"> -->
	<!-- 		<div class="text-text-muted flex items-center gap-2 text-xs font-medium"> -->
	<!-- 			<span>Show</span> -->
	<!-- 			<select -->
	<!-- 				bind:value={entriesPerPage} -->
	<!-- 				class="bg-scitech-navy focus:border-scitech-mint cursor-pointer rounded-xl border border-white/15 px-3 py-1.5 text-white transition-colors focus:outline-none" -->
	<!-- 			> -->
	<!-- 				<option value={10}>10</option> -->
	<!-- 				<option value={25}>25</option> -->
	<!-- 				<option value={50}>50</option> -->
	<!-- 			</select> -->
	<!-- 			<span>entries</span> -->
	<!-- 		</div> -->
	<!---->
	<!-- 		<div class="relative w-full md:w-72"> -->
	<!-- 			<Search class="text-text-muted absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" /> -->
	<!-- 			<input -->
	<!-- 				type="text" -->
	<!-- 				placeholder="Search..." -->
	<!-- 				bind:value={searchQuery} -->
	<!-- 				class="bg-scitech-navy/80 placeholder:text-text-muted focus:border-scitech-mint/80 w-full rounded-xl border border-white/15 py-2.5 pr-4 pl-10 text-xs text-white transition-all focus:outline-none" -->
	<!-- 			/> -->
	<!-- 		</div> -->
	<!-- 	</div> -->

	<!-- Data Table -->
	<!-- <div class="bg-scitech-navy/40 overflow-x-auto rounded-2xl border border-white/10"> -->
	<!-- <table class="w-full border-collapse text-left"> -->
	<!-- 	<thead> -->
	<!-- 		<tr -->
	<!-- 			class="bg-scitech-navy/90 text-text-muted border-b border-white/10 font-mono text-[11px] tracking-wider uppercase" -->
	<!-- 		> -->
	<!-- 			<th class="w-3/4 p-4"> -->
	<!-- 				<div class="flex items-center gap-2"> -->
	<!-- 					<span>Nama</span> -->
	<!-- 					<ArrowUpDown class="text-scitech-cyan h-3 w-3" /> -->
	<!-- 				</div> -->
	<!-- 			</th> -->
	<!-- 			<th class="w-1/4 p-4 text-center">Menu</th> -->
	<!-- 		</tr> -->
	<!-- 	</thead> -->
	<!-- 	<tbody class="divide-y divide-white/5 text-xs"> -->
	<!-- 		{#each filteredList as item (item.id)} -->
	<!-- 			<tr class="group transition-colors hover:bg-white/[0.03]"> -->
	<!-- 				<td -->
	<!-- 					class="group-hover:text-scitech-mint p-4 font-mono text-sm font-bold text-white transition-colors" -->
	<!-- 				> -->
	<!-- 					Angkatan {item.nama} -->
	<!-- 				</td> -->
	<!-- 				<td class="p-4"> -->
	<!-- 					<div class="flex items-center justify-center gap-2"> -->
	<!-- 						<button -->
	<!-- 							title="Edit" -->
	<!-- 							class="bg-scitech-cyan/10 hover:bg-scitech-cyan/20 text-scitech-cyan border-scitech-cyan/30 rounded-lg border p-2 transition-all active:scale-95" -->
	<!-- 						> -->
	<!-- 							<Edit3 class="h-3.5 w-3.5" /> -->
	<!-- 						</button> -->
	<!-- 						<button -->
	<!-- 							title="Hapus" -->
	<!-- 							onclick={() => handleDelete(item.id)} -->
	<!-- 							class="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20 active:scale-95" -->
	<!-- 						> -->
	<!-- 							<Trash2 class="h-3.5 w-3.5" /> -->
	<!-- 						</button> -->
	<!-- 					</div> -->
	<!-- 				</td> -->
	<!-- 			</tr> -->
	<!-- 		{/each} -->
	<!-- 	</tbody> -->
	<!-- </table> -->
</div>
<!-- pindahkan ke table sekarang -->
<TableContent
	title="Data Angkatan"
	addButtonLabel="+ Angkatan"
	data={filteredList}
	onAdd={() => (isAddModalOpen = true)}
	onEdit={(item) => console.log('Edit:', item)}
	onDelete={handleDelete}
/>

<!-- Pagination Footer -->
<!-- 		<div class="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row"> -->
<!-- 			<span class="text-text-muted font-mono text-xs"> -->
<!-- 				Showing 1 to {filteredList.length} of {filteredList.length} entries -->
<!-- 			</span> -->
<!---->
<!-- 			<div class="flex items-center gap-1"> -->
<!-- 				<button -->
<!-- 					disabled -->
<!-- 					class="bg-scitech-navy text-text-muted rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs opacity-40" -->
<!-- 					>Previous</button -->
<!-- 				> -->
<!-- 				<button -->
<!-- 					class="bg-scitech-mint text-scitech-navy rounded-lg px-3 py-1.5 font-mono text-xs font-bold" -->
<!-- 					>1</button -->
<!-- 				> -->
<!-- 				<button -->
<!-- 					disabled -->
<!-- 					class="bg-scitech-navy text-text-muted rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs opacity-40" -->
<!-- 					>Next</button -->
<!-- 				> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- </div> -->

<!-- Modal Tambah Angkatan -->
{#if isAddModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
		<div
			class="bg-scitech-navy w-full max-w-md space-y-6 rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8"
		>
			<div class="flex items-center justify-between border-b border-white/10 pb-4">
				<h3 class="text-base font-bold text-white">Tambah Angkatan Baru</h3>
				<button onclick={() => (isAddModalOpen = false)} class="text-text-muted hover:text-white"
					><X class="h-5 w-5" /></button
				>
			</div>

			<form onsubmit={handleAddAngkatan} class="space-y-4">
				<div>
					<label class="text-text-muted mb-1 block text-xs" for="nama_angkatan"
						>Tahun Angkatan</label
					>
					<input
						id="nama_angkatan"
						type="text"
						required
						bind:value={newNama}
						placeholder="Contoh: 2024"
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					/>
				</div>

				<div class="flex justify-end gap-3 pt-4">
					<button
						type="button"
						onclick={() => (isAddModalOpen = false)}
						class="text-text-muted rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold"
						>Batal</button
					>
					<button
						type="submit"
						class="text-scitech-navy bg-scitech-mint rounded-xl px-5 py-2 text-xs font-bold"
						>Simpan</button
					>
				</div>
			</form>
		</div>
	</div>
{/if}
