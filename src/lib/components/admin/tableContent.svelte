<script lang="ts">


// 
// semua desian Halaman yang mengguakanTable akan memanggil Compoennt ini 
// 

  import type { TableContentType , tableItem } from '$lib/types/tableContent';
	import {
		ArrowUpDown,
		Edit3,
		Trash2,
		AlertTriangle,
		X,
		Search,
		ChevronLeft,
		ChevronRight,
		Plus
	} from 'lucide-svelte';

	let {
		title = '',
		addButtonLabel = '',
		data = [],
		onAdd,
		onEdit,
		onDelete
	}: {
		title?: string;
		addButtonLabel?: string;
		data: TableContentType[];
		// optional
    onAdd?: () => void;
		onEdit?: (item: TableContentType) => void;
		onDelete?: (item: TableContentType) => void;
	} = $props();

	// State internal
	let searchQuery = $state('');
	let entriesPerPage = $state(10);
	let currentPage = $state(1);
	let itemToDelete = $state<TableContentType | null>(null);

	// Ambil daftar kolom secara otomatis dari baris data pertama
	let columns = $derived.by(() => {
		if (data.length === 0) return [];
		return data[0].items.map((it) => it.colomn);
	});

	// Filter pencarian
	let filteredData = $derived.by(() => {
		if (!searchQuery.trim()) return data;
		const query = searchQuery.toLowerCase();
		return data.filter((row) =>
			row.items.some((it) => String(it.row).toLowerCase().includes(query))
		);
	});

	// Paginasi Data
	let totalEntries = $derived(filteredData.length);
	let totalPages = $derived(Math.ceil(totalEntries / entriesPerPage) || 1);
	let startIndex = $derived((currentPage - 1) * entriesPerPage);
	let endIndex = $derived(Math.min(startIndex + entriesPerPage, totalEntries));

	let paginatedData = $derived.by(() => {
		return filteredData.slice(startIndex, startIndex + entriesPerPage);
	});

	// Helper deteksi URL Gambar
	function checkIsImage(item: tableItem): boolean {
		if (item.isImage) return true;
		if (typeof item.row !== 'string') return false;
		return (
			item.row.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) !== null ||
			item.row.startsWith('data:image/')
		);
	}

	// Helper deteksi Tautan Link
	function checkIsLink(item: tableItem): boolean {
		if (item.isLink) return true;
		if (typeof item.row !== 'string') return false;
		return item.row.startsWith('http://') || item.row.startsWith('https://');
	}

	function handleConfirmDelete() {
		if (itemToDelete && onDelete) {
			onDelete(itemToDelete);
		}
		itemToDelete = null;
	}
</script>

<div class="space-y-4 rounded-2xl border border-white/10 bg-scitech-slate/50 p-5 shadow-2xl backdrop-blur-xl">
	<!-- header action & title bar -->
	{#if title || addButtonLabel}
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
			{#if title}
				<h2 class="text-sm font-bold text-scitech-mint tracking-wide">{title}</h2>
			{/if}

			{#if addButtonLabel && onAdd}
				<button
					type="button"
					onclick={onAdd}
					class="inline-flex items-center justify-center gap-1.5 rounded-xl bg-scitech-mint px-4 py-2 text-xs font-bold text-scitech-navy shadow-md shadow-scitech-mint/10 transition-all hover:bg-scitech-mint-hover active:scale-95 sm:w-auto"
				>
					<Plus class="h-4 w-4" />
					<span>{addButtonLabel}</span>
				</button>
			{/if}
		</div>
	{/if}

	<div class="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between text-text-muted">
		<div class="flex items-center gap-2">
			<span>Show</span>
			<select
				bind:value={entriesPerPage}
				class="rounded-lg border border-white/10 bg-scitech-navy px-2.5 py-1.5 text-white focus:border-scitech-mint focus:outline-none"
			>
				<option value={5}>5</option>
				<option value={10}>10</option>
				<option value={25}>25</option>
				<option value={50}>50</option>
			</select>
			<span>entries</span>
		</div>

		<div class="relative w-full sm:w-64">
			<Search class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search..."
				class="w-full rounded-lg border border-white/10 bg-scitech-navy pl-9 pr-3 py-1.5 text-xs text-white placeholder-text-muted transition-all focus:border-scitech-mint focus:outline-none"
			/>
		</div>
	</div>

	<!-- TABEL UTAMA -->
	<div class="overflow-x-auto rounded-xl border border-white/10 bg-scitech-navy/60">
		<table class="w-full border-collapse text-left text-xs">
			<!-- Table Header -->
			<thead>
				<tr class="border-b border-white/10 bg-white/5 font-mono text-[11px] text-text-muted tracking-wider uppercase">
					{#each columns as col}
						<th class="p-3.5">
							<div class="flex items-center gap-1.5">
								<span>{col}</span>
								<ArrowUpDown class="h-3 w-3 text-scitech-cyan/70" />
							</div>
						</th>
					{/each}
					<th class="p-3.5 text-center w-28">Menu</th>
				</tr>
			</thead>

			<!-- Table Body -->
			<tbody class="divide-y divide-white/5 text-text-muted">
				{#if paginatedData.length === 0}
					<tr>
						<td colspan={columns.length + 1} class="p-8 text-center font-mono text-text-muted">
							Data tidak ditemukan.
						</td>
					</tr>
				{:else}
					{#each paginatedData as rowData (rowData.id)}
						<tr class="group transition-colors hover:bg-white/[0.03]">
							{#each rowData.items as item}
								<td class="p-3.5 align-middle">
									{#if checkIsImage(item)}
										<!-- Tampilan Gambar/Foto -->
										<div class="h-16 w-24 overflow-hidden rounded-lg border border-white/10 bg-black/40">
											<img
												src={String(item.row)}
												alt={item.colomn}
												class="h-full w-full object-cover transition-transform group-hover:scale-105"
											/>
										</div>
									{:else if checkIsLink(item)}
										<!-- Tampilan Tautan/Link -->
										<a
											href={String(item.row)}
											target="_blank"
											rel="noopener noreferrer"
											class="text-scitech-cyan hover:underline break-all"
										>
											{item.row}
										</a>
									{:else}
										<!-- Tampilan Teks Biasa -->
										<span class="text-white group-hover:text-scitech-mint transition-colors">
											{item.row}
										</span>
									{/if}
								</td>
							{/each}

							<!-- Menu Action (Edit & Delete) -->
							<td class="p-3.5 align-middle">
								<div class="flex items-center justify-center gap-2">
									{#if onEdit}
										<button
											type="button"
											title="Edit"
											onclick={() => onEdit(rowData)}
											class="rounded-lg border border-scitech-cyan/30 bg-scitech-cyan/10 p-2 text-scitech-cyan transition-all hover:bg-scitech-cyan/20 active:scale-95"
										>
											<Edit3 class="h-3.5 w-3.5" />
										</button>
									{/if}
									{#if onDelete}
										<button
											type="button"
											title="Hapus"
											onclick={() => (itemToDelete = rowData)}
											class="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
										>
											<Trash2 class="h-3.5 w-3.5" />
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>

			<!-- Table Footer Header (Meniru gaya gambar) -->
			<tfoot>
				<tr class="border-t border-white/10 bg-white/5 font-mono text-[11px] text-text-muted">
					{#each columns as col}
						<th class="p-3">{col}</th>
					{/each}
					<th class="p-3 text-center">Menu</th>
				</tr>
			</tfoot>
		</table>
	</div>

	<!-- footer datatable: showing info & pagination -->
	<div class="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between text-text-muted">
		<div>
			Showing {totalEntries === 0 ? 0 : startIndex + 1} to {endIndex} of {totalEntries} entries
		</div>

		<!-- Pagination Buttons -->
		<div class="flex items-center gap-1">
			<button
				type="button"
				disabled={currentPage === 1}
				onclick={() => currentPage--}
				class="rounded-lg border border-white/10 px-3 py-1.5 transition-all hover:bg-white/5 disabled:opacity-30"
			>
				Previous
			</button>

			{#each Array(totalPages) as _, i}
				<button
					type="button"
					onclick={() => (currentPage = i + 1)}
					class="rounded-lg px-3 py-1.5 font-bold transition-all {currentPage === i + 1
						? 'bg-scitech-mint text-scitech-navy'
						: 'border border-white/10 text-white hover:bg-white/5'}"
				>
					{i + 1}
				</button>
			{/each}

			<button
				type="button"
				disabled={currentPage === totalPages || totalPages === 0}
				onclick={() => currentPage++}
				class="rounded-lg border border-white/10 px-3 py-1.5 transition-all hover:bg-white/5 disabled:opacity-30"
			>
				Next
			</button>
		</div>
	</div>
</div>

<!-- --------------------------------MODAL----------------------  -->

<!-- modal alert konfirmasi hapus -->
{#if itemToDelete}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scitech-navy/80 backdrop-blur-md">
		<div class="w-full max-w-md rounded-2xl border border-red-500/30 bg-scitech-slate p-6 shadow-2xl space-y-4">
			<div class="flex items-center justify-between border-b border-white/10 pb-3">
				<div class="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
					<AlertTriangle class="h-4 w-4" />
					<span>Konfirmasi Hapus Data</span>
				</div>
				<button type="button" onclick={() => (itemToDelete = null)} class="text-text-muted hover:text-white">
					<X class="h-4 w-4" />
				</button>
			</div>

			<p class="text-xs text-text-muted leading-relaxed">
				Apakah Anda yakin ingin menghapus data entri ini? Tindakan ini tidak dapat dibatalkan.
			</p>

			<div class="flex items-center justify-end gap-3 pt-2">
				<button
					type="button"
					onclick={() => (itemToDelete = null)}
					class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10"
				>
					Batal
				</button>
				<button
					type="button"
					onclick={handleConfirmDelete}
					class="rounded-xl border border-red-500/40 bg-red-500/20 px-4 py-2 text-xs font-bold text-red-300 transition-all hover:bg-red-500/30 active:scale-95"
				>
					Hapus Data
				</button>
			</div>
		</div>
	</div>
{/if}



<!-- contoh penggunaan  -->
<!---->
<!-- <script lang="ts"> -->
<!-- 	import DataTable from '$lib/components/DataTable.svelte'; -->
<!-- 	import type { TableContentType } from '$lib/types/table'; -->
<!---->
<!-- 	let dataPeriode: TableContentType[] = [ -->
<!-- 		{ id: 1, items: [{ colomn: 'Periode', row: 'Periode 2018 - 2021' }] }, -->
<!-- 		{ id: 2, items: [{ colomn: 'Periode', row: 'Periode 2020 - 2022' }] }, -->
<!-- 		{ id: 3, items: [{ colomn: 'Periode', row: 'Periode 2022 - 2024' }] } -->
<!-- 	]; -->
<!-- </script> -->
<!---->
<!-- <DataTable -->
<!-- 	title="Data Sejarah Pimpinan Jurusan" -->
<!-- 	addButtonLabel="+ Periode" -->
<!-- 	data={dataPeriode} -->
<!-- 	onAdd={() => alert('Tambah Periode')} -->
<!-- 	onEdit={(item) => console.log('Edit', item)} -->
<!-- 	onDelete={(item) => console.log('Delete', item)} -->
<!-- /> -->

