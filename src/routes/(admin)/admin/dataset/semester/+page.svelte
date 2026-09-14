<script lang="ts">
	import {
		Calendar,
		Plus,
		Search,
		ArrowUpDown,
		Edit3,
		Trash2,
		Sparkles,
		Link2,
		ChevronLeft,
		ChevronRight,
		X
	} from 'lucide-svelte';

	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import { goto } from '$app/navigation';
	import { mergeNewPath } from '$lib/utils';

	//	interface SemesterItem {
	//	id: string;
	//	nama: string;
	//		link: string;
	//	}

	// Data Semester sesuai Gambar 1
	let semesterList = $state<TableContentType[]>([
		{
			id: '1',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Ganjil 2020/2021' },
				{ colomn: 'Tautan', row: '/ganjil20-21', isLink: true }
			]
		},
		{
			id: '2',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Ganjil 2021/2022' },
				{ colomn: 'Tautan', row: '/ganjil21-22', isLink: true }
			]
		},
		{
			id: '3',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Ganjil 2022/2023' },
				{ colomn: 'Tautan', row: '/ganjil22-23', isLink: true }
			]
		},
		{
			id: '4',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Ganjil 2023/2024' },
				{ colomn: 'Tautan', row: '/ganjil23-24', isLink: true }
			]
		},
		{
			id: '5',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Ganjil 2024/2025' },
				{ colomn: 'Tautan', row: '/ganjil24-25', isLink: true }
			]
		},
		{
			id: '6',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Ganjil 2025/2026' },
				{ colomn: 'Tautan', row: '/ganjil25-26', isLink: true }
			]
		},
		{
			id: '7',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Genap 2019/2020' },
				{ colomn: 'Tautan', row: '/genap19-20', isLink: true }
			]
		},
		{
			id: '8',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Genap 2020/2021' },
				{ colomn: 'Tautan', row: '/genap20-21', isLink: true }
			]
		},
		{
			id: '9',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Genap 2021/2022' },
				{ colomn: 'Tautan', row: '/genap21-22', isLink: true }
			]
		},
		{
			id: '10',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Genap 2022/2023' },
				{ colomn: 'Tautan', row: '/genap22-23', isLink: true }
			]
		},
		{
			id: '11',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Genap 2023/2024' },
				{ colomn: 'Tautan', row: '/genap23-24', isLink: true }
			]
		},
		{
			id: '12',
			items: [
				{ colomn: 'Nama Semester', row: 'Semester Genap 2024/2025' },
				{ colomn: 'Tautan', row: '/genap24-25', isLink: true }
			]
		}
	]); // State Management
	let searchQuery = $state('');
	let entriesPerPage = $state(10);
	let currentPage = $state(1);
	let isAddModalOpen = $state(false);

	// Form Fields
	let newNama = $state<string>('');
	let newLink = $state<string>('');

	// Derived Filtered Data
	let filteredList = $derived(
		semesterList.filter((item) =>
			item.items.some((col) => col.row.toString().toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	function handleAddSemester(e: SubmitEvent) {
		e.preventDefault();
		if (!newNama || !newLink) return;

		// Membuat item baru yang sesuai dengan interface TableContentType
		const newItem: TableContentType = {
			id: Date.now().toString(),
			items: [
				{ colomn: 'Nama Semester', row: newNama },
				{ colomn: 'Tautan', row: newLink, isLink: true }
			]
		};

		semesterList = [...semesterList, newItem];
		newNama = '';
		newLink = '';
		isAddModalOpen = false;
	}

	function handleDelete(id: string | number) {
		semesterList = semesterList.filter((item) => item.id !== id);
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
		<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Semester</h1>
	</div>

	<!-- Main Table Container Card -->
	<div
		class="bg-scitech-slate/60 space-y-6 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<!-- Top Action Bar -->
		<!-- <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"> -->
		<!-- 	<div class="flex items-center gap-3"> -->
		<!-- 		<div -->
		<!-- 			class="bg-scitech-mint/10 text-scitech-mint border-scitech-mint/20 rounded-2xl border p-2.5" -->
		<!-- 		> -->
		<!-- 			<Calendar class="h-5 w-5" /> -->
		<!-- 		</div> -->
		<!-- 		<div> -->
		<!-- 			<h2 class="text-base font-bold text-white sm:text-lg">Data Semester Tahun Akademik</h2> -->
		<!-- 			<p class="text-xs text-text-muted">Kelola periode semester dan tautan sistemik</p> -->
		<!-- 		</div> -->
		<!-- 	</div> -->
		<!---->
		<!-- 	<button -->
		<!-- 		onclick={() => (isAddModalOpen = true)} -->
		<!-- 		class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover shadow-scitech-mint/20 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all duration-200 active:scale-95 sm:text-sm" -->
		<!-- 	> -->
		<!-- 		<Plus class="h-4 w-4" /> -->
		<!-- 		<span>+ Semester</span> -->
		<!-- 	</button> -->
		<!-- </div> -->

		<!-- <div class="flex flex-col justify-between gap-4 pt-2 md:flex-row md:items-center"> -->
		<!-- 	<div class="flex items-center gap-2 text-xs font-medium text-text-muted"> -->
		<!-- 		<span>Show</span> -->
		<!-- 		<select -->
		<!-- 			bind:value={entriesPerPage} -->
		<!-- 			class="bg-scitech-navy focus:border-scitech-mint cursor-pointer rounded-xl border border-white/15 px-3 py-1.5 text-white transition-colors focus:outline-none" -->
		<!-- 		> -->
		<!-- 			<option value={10}>10</option> -->
		<!-- 			<option value={25}>25</option> -->
		<!-- 			<option value={50}>50</option> -->
		<!-- 		</select> -->
		<!-- 		<span>entries</span> -->
		<!-- 	</div> -->
		<!---->
		<!-- 	<div class="relative w-full md:w-72"> -->
		<!-- 		<Search class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-text-muted" /> -->
		<!-- 		<input -->
		<!-- 			type="text" -->
		<!-- 			placeholder="Search..." -->
		<!-- 			bind:value={searchQuery} -->
		<!-- 			class="bg-scitech-navy/80 focus:border-scitech-mint/80 w-full rounded-xl border border-white/15 py-2.5 pr-4 pl-10 text-xs text-white transition-all placeholder:text-text-muted focus:outline-none" -->
		<!-- 		/> -->
		<!-- 	</div> -->
		<!-- </div> -->

		<!-- Data Table -->
		<div class="bg-scitech-navy/40 overflow-x-auto rounded-2xl border border-white/10">
			<TableContent
				title="Data Angkatan"
				addButtonLabel="Semester"
				data={filteredList}
				onAdd={() => goto(mergeNewPath("add"))}
				onEdit={(item) => console.log('Edit:', item)}
				onDelete={() => console.info('delete')}
			/>

			<!-- <table class="w-full border-collapse text-left"> -->
			<!-- 	<thead> -->
			<!-- 		<tr -->
			<!-- 			class="bg-scitech-navy/90 text-text-muted border-b border-white/10 font-mono text-[11px] tracking-wider uppercase" -->
			<!-- 		> -->
			<!-- 			<th class="p-4"> -->
			<!-- 				<div class="flex items-center gap-2"> -->
			<!-- 					<span>Nama</span> -->
			<!-- 					<ArrowUpDown class="text-scitech-cyan h-3 w-3" /> -->
			<!-- 				</div> -->
			<!-- 			</th> -->
			<!-- 			<th class="p-4"> -->
			<!-- 				<div class="flex items-center gap-2"> -->
			<!-- 					<span>Link</span> -->
			<!-- 					<ArrowUpDown class="text-scitech-cyan h-3 w-3" /> -->
			<!-- 				</div> -->
			<!-- 			</th> -->
			<!-- 			<th class="p-4 text-center">Menu</th> -->
			<!-- 		</tr> -->
			<!-- 	</thead> -->
			<!-- 	<tbody class="divide-y divide-white/5 text-xs"> -->
			<!-- 		{#each filteredList as item (item.id)} -->
			<!-- 			<tr class="group transition-colors hover:bg-white/[0.03]"> -->
			<!-- 				<td -->
			<!-- 					class="group-hover:text-scitech-mint p-4 font-medium text-white transition-colors" -->
			<!-- 				> -->
			<!-- 					{item.nama} -->
			<!-- 				</td> -->
			<!-- 				<td class="text-scitech-cyan/90 p-4 font-mono"> -->
			<!-- 					<span -->
			<!-- 						class="bg-scitech-cyan/10 border-scitech-cyan/20 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1" -->
			<!-- 					> -->
			<!-- 						<Link2 class="h-3 w-3" /> -->
			<!-- 						{item.link} -->
			<!-- 					</span> -->
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

		<!-- Pagination Footer -->
		<div class="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
			<span class="font-mono text-xs text-text-muted">
				Showing 1 to {filteredList.length} of {filteredList.length} entries
			</span>

			<div class="flex items-center gap-1">
				<button
					disabled
					class="bg-scitech-navy rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-text-muted opacity-40"
					>Previous</button
				>
				<button
					class="bg-scitech-mint text-scitech-navy rounded-lg px-3 py-1.5 font-mono text-xs font-bold"
					>1</button
				>
				<button
					disabled
					class="bg-scitech-navy rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-text-muted opacity-40"
					>Next</button
				>
			</div>
		</div>
	</div>
</div>

<!-- Modal Tambah Semester -->
<!-- {#if isAddModalOpen} -->
<!-- 	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"> -->
<!-- 		<div -->
<!-- 			class="bg-scitech-navy w-full max-w-md space-y-6 rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8" -->
<!-- 		> -->
<!-- 			<div class="flex items-center justify-between border-b border-white/10 pb-4"> -->
<!-- 				<h3 class="text-base font-bold text-white">Tambah Semester Baru</h3> -->
<!-- 				<button onclick={() => (isAddModalOpen = false)} class="text-text-muted hover:text-white" -->
<!-- 					><X class="h-5 w-5" /></button -->
<!-- 				> -->
<!-- 			</div> -->
<!---->
<!-- 			<form onsubmit={handleAddSemester} class="space-y-4"> -->
<!-- 				<div> -->
<!-- 					<label class="mb-1 block text-xs text-text-muted" for="nama">Nama Semester</label> -->
<!-- 					<input -->
<!-- 						id="nama" -->
<!-- 						type="text" -->
<!-- 						required -->
<!-- 						bind:value={newNama} -->
<!-- 						placeholder="Contoh: Semester Ganjil 2024/2025" -->
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none" -->
<!-- 					/> -->
<!-- 				</div> -->
<!-- 				<div> -->
<!-- 					<label class="mb-1 block text-xs text-text-muted" for="link">Link Slug</label> -->
<!-- 					<input -->
<!-- 						id="link" -->
<!-- 						type="text" -->
<!-- 						required -->
<!-- 						bind:value={newLink} -->
<!-- 						placeholder="Contoh: ganjil24-25" -->
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none" -->
<!-- 					/> -->
<!-- 				</div> -->
<!---->
<!-- 				<div class="flex justify-end gap-3 pt-4"> -->
<!-- 					<button -->
<!-- 						type="button" -->
<!-- 						onclick={() => (isAddModalOpen = false)} -->
<!-- 						class="rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold text-text-muted" -->
<!-- 						>Batal</button -->
<!-- 					> -->
<!-- 					<button -->
<!-- 						type="submit" -->
<!-- 						class="text-scitech-navy bg-scitech-mint rounded-xl px-5 py-2 text-xs font-bold" -->
<!-- 						>Simpan</button -->
<!-- 					> -->
<!-- 				</div> -->
<!-- 			</form> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- {/if} -->
