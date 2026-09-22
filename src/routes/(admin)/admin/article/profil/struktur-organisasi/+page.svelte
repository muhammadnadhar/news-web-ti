<script lang="ts">
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { TableContentType } from '$lib/types/tableContent.js';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import type { OrgStructureItemDTO } from '$lib/dto/admin/article/profile.js';

	let { data } = $props();

	// State untuk Search dan Pagination
	let searchQuery = $state('');
	let entriesPerPage = $state(10);
	let currentPage = $state(1);

	// Function Mapper: Mengubah DTO dari Database ke format TableContentType
	function mapToTableContent(items: OrgStructureItemDTO[]): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{ colomn: 'Gambar', row: item.image_url || '-', isImage: true },
				{ colomn: 'Judul / Jabatan', row: item.title },
				{ colomn: 'Deskripsi', row: item.description || '-' }
			]
		}));
	}

	// Filter data berdasarkan query pencarian
	let filteredData: OrgStructureItemDTO[] = $derived(
		(data.orgStructures || []).filter((item) => {
			const query = searchQuery.toLowerCase();
			return (
				item.title.toLowerCase().includes(query) ||
				(item.description && item.description.toLowerCase().includes(query))
			);
		})
	);

	// Pagination Calculation
	let totalEntries = $derived(filteredData.length);
	let totalPages = $derived(Math.ceil(totalEntries / entriesPerPage) || 1);
	let startIndex = $derived((currentPage - 1) * entriesPerPage);
	let paginatedData = $derived(filteredData.slice(startIndex, startIndex + entriesPerPage));

	// Menambahkan URL ke route /add
	function handleAdd() {
		goto(`${page.url.pathname}/add`);
	}

	// Navigasi Edit berdasarkan ID
	function handleEdit(item: TableContentType) {
		goto(`${page.url.pathname}/edit/${item.id}`);
	}


</script>

{#await data.orgStructures}
	<TableSkeleton showTitle={true} title="Memuat Data Kerjasama..." columnsCount={4} />
{:then orgStructures}
	<TableContent
		title="Struktur Organisasi"
		addButtonLabel="Tambah Struktur"
		data={mapToTableContent(orgStructures)}
		onAdd={handleAdd}
		onEdit={handleEdit}
    
		deleteAction="?/delete"
		onDeleteSuccess={(res) =>
			triggerMessage(
				res?.status ?? 'success',
				res?.title ?? 'Berhasil',
				res?.message ?? 'Data angkatan berhasil dihapus.'
			)}
		onDeleteError={(res) =>
			triggerMessage(
				res?.status ?? 'error',
				res?.title ?? 'Gagal',
				res?.message ?? 'Gagal menghapus data angkatan.'
			)}
	/>
{:catch error}
	<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
		Gagal memuat data: {error.message}
	</div>
{/await}

<!-- <div class="space-y-6 p-6 lg:p-10"> -->
<!-- 	<div class="border-scitech-slate/20 border-b pb-4"> -->
<!-- 		<h1 class="text-2xl font-bold tracking-tight text-text-main capitalize">Struktur Organisasi</h1> -->
<!-- 	</div> -->
<!---->
<!-- 	<div -->
<!-- 		class="border-scitech-slate/20 bg-scitech-navy-glare space-y-4 rounded-2xl border p-6 shadow-xl" -->
<!-- 	> -->
<!-- 		<div class="border-scitech-slate/10 flex items-center justify-between border-b pb-4"> -->
<!-- 			<h2 class="text-scitech-cyan text-sm font-semibold">Data Struktur Organisasi</h2> -->
<!-- 			<button -->
<!-- 				type="button" -->
<!-- 				class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-text-main shadow-md transition-all hover:bg-indigo-700 active:scale-95" -->
<!-- 			> -->
<!-- 				<Plus class="h-4 w-4" /> -->
<!-- 				<span>Struktur Organisasi</span> -->
<!-- 			</button> -->
<!-- 		</div> -->
<!---->
<!-- controls: entries & search -->
<!-- <div -->
<!-- 	class="flex flex-col gap-4 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between" -->
<!-- > -->
<!-- 	<div class="flex items-center gap-2"> -->
<!-- 		<span>Show</span> -->
<!-- 		<select -->
<!-- 			bind:value={entriesPerPage} -->
<!-- 			class="bg-scitech-navy border-scitech-slate/30 rounded-lg border px-2 py-1 text-text-main focus:outline-none" -->
<!-- 		> -->
<!-- 			<option value={10}>10</option> -->
<!-- 			<option value={25}>25</option> -->
<!-- 			<option value={50}>50</option> -->
<!-- 		</select> -->
<!-- 		<span>entries</span> -->
<!-- 	</div> -->
<!---->
<!-- 	<div class="flex items-center gap-2"> -->
<!-- 		<span>Search:</span> -->
<!-- 		<input -->
<!-- 			type="text" -->
<!-- 			bind:value={searchQuery} -->
<!-- 			class="bg-scitech-navy border-scitech-slate/30 focus:border-scitech-mint rounded-lg border px-3 py-1 text-text-main focus:outline-none" -->
<!-- 		/> -->
<!-- 	</div> -->
<!-- </div> -->

<!-- table content -->
<!-- <TableContent addButtonLabel={'add organiasiasi'} onAdd={() => goto(mergeNewPath('add'))}> -->
<!-- 	{#snippet header()} -->
<!-- 		<tr> -->
<!-- 			<th class="w-1/4 p-3 text-left font-semibold">Judul</th> -->
<!-- 			<th class="w-32 p-3 text-left font-semibold">Foto</th> -->
<!-- 			<th class="p-3 text-left font-semibold">Description</th> -->
<!-- 			<th class="w-24 p-3 text-center font-semibold">Menu</th> -->
<!-- 		</tr> -->
<!-- 	{/snippet} -->
<!---->
<!-- 	{#snippet body()} -->
<!-- 		{#if paginatedData.length === 0} -->
<!-- 			<tr> -->
<!-- 				<td colspan="4" class="p-6 text-center text-text-muted"> -->
<!-- 					Tidak ada data struktur organisasi ditemukan. -->
<!-- 				</td> -->
<!-- 			</tr> -->
<!-- 		{:else} -->
<!-- 			{#each paginatedData as item} -->
<!-- 				<tr class="border-scitech-slate/10 border-b transition-colors hover:bg-white/5"> -->
<!-- 					<!-- JUDUL --> -->
<!-- 					<td class="p-3 align-top font-medium text-text-main">{item.title}</td> -->
<!---->
<!-- 					<!-- foto preview thumbnail --> -->
<!-- 					<td class="p-3 align-top"> -->
<!-- 						{#if item.image_url} -->
<!-- 							<div -->
<!-- 								class="border-scitech-slate/30 bg-scitech-navy h-20 w-32 overflow-hidden rounded-lg border p-1 shadow-sm" -->
<!-- 							> -->
<!-- 								<img -->
<!-- 									src={item.image_url} -->
<!-- 									alt={item.title} -->
<!-- 									class="h-full w-full rounded object-cover" -->
<!-- 								/> -->
<!-- 							</div> -->
<!-- 						{:else} -->
<!-- 							<div -->
<!-- 								class="border-scitech-slate/30 bg-scitech-navy flex h-20 w-32 items-center justify-center rounded-lg border text-[10px] text-text-muted" -->
<!-- 							> -->
<!-- 								<ImageIcon class="h-5 w-5 opacity-40" /> -->
<!-- 							</div> -->
<!-- 						{/if} -->
<!-- 					</td> -->
<!---->
<!-- 					<!-- DESKRIPSI --> -->
<!-- 					<td class="p-3 align-top text-xs leading-relaxed text-text-muted"> -->
<!-- 						{item.description || '-'} -->
<!-- 					</td> -->
<!---->
<!-- 					<!-- ACTION MENU --> -->
<!-- 					<td class="p-3 text-center align-top"> -->
<!-- 						<div class="flex items-center justify-center gap-1"> -->
<!-- 							<!-- BUTTON EDIT --> -->
<!-- 							<button -->
<!-- 								type="button" -->
<!-- 								class="rounded bg-cyan-500 p-1.5 text-text-main transition-all hover:bg-cyan-600" -->
<!-- 								title="Edit Data" -->
<!-- 							> -->
<!-- 								<Edit class="h-3.5 w-3.5" /> -->
<!-- 							</button> -->
<!---->
<!-- 							<!-- BUTTON DELETE --> -->
<!-- 							<form method="POST" action="?/delete" use:enhance class="inline"> -->
<!-- 								<input type="hidden" name="id" value={item.id} /> -->
<!-- 								<button -->
<!-- 									type="submit" -->
<!-- 									class="rounded bg-rose-500 p-1.5 text-text-main transition-all hover:bg-rose-600" -->
<!-- 									title="Hapus Data" -->
<!-- 								> -->
<!-- 									<Trash2 class="h-3.5 w-3.5" /> -->
<!-- 								</button> -->
<!-- 							</form> -->
<!-- 						</div> -->
<!-- 					</td> -->
<!-- 				</tr> -->
<!-- 			{/each} -->
<!-- 		{/if} -->
<!-- 	{/snippet} -->
<!---->
<!-- 	{#snippet footer()} -->
<!-- 		<tr> -->
<!-- 			<th class="p-3 text-left font-semibold">Judul</th> -->
<!-- 			<th class="p-3 text-left font-semibold">Foto</th> -->
<!-- 			<th class="p-3 text-left font-semibold">Description</th> -->
<!-- 			<th class="p-3 text-center font-semibold">Menu</th> -->
<!-- 		</tr> -->
<!-- 	{/snippet} -->
<!-- </TableContent> -->
<!-- 	</div> -->
<!-- </div> -->
