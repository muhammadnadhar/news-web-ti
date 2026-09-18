<script lang="ts">
	import { Users, Plus, Search, ArrowUpDown, Edit3, Trash2, Sparkles, X } from 'lucide-svelte';

	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import type { AngkatanDTO } from '$lib/types/admin/dataset.js';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import { page } from '$app/state';
	import type { ResponseMessage } from '$lib/types/message.js';
	import Message from '$lib/components/admin/message.svelte';

	// Data Angkatan sesuai Gambar 2
	let { data } = $props();

	// State Management
	let searchQuery = $state('');
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let yearInput = $state('');

	/**
	 * Mengubah list AngkatanDTO menjadi format TableContentType
	 */
	export function mapAngkatanToTableContent(dataList: AngkatanDTO[]): TableContentType[] {
		if (!Array.isArray(dataList)) return [];

		return dataList.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Tahun Angkatan',
					row: item.year ?? '-'
				},
				{
					colomn: 'Tanggal Dibuat',
					row: item.created_at
						? new Date(item.created_at).toLocaleDateString('id-ID', {
								day: 'numeric',
								month: 'short',
								year: 'numeric'
							})
						: '-'
				}
			]
		}));
	}

	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	// Sync local state dengan data server
	let angkatanList = $derived<TableContentType[]>(data.angkatanList || []);

	// Filtered Data
	let filteredList = $derived(
		angkatanList.filter((item) =>
			item.items.some((col) => String(col.row).toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	// Modal Controls
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		yearInput = '';
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;
		const nameCol = item.items.find((col) => col.colomn === 'Nama');
		yearInput = nameCol ? String(nameCol.row) : '';
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		yearInput = '';
		selectedId = '';
	}
</script>

<div class="mx-auto max-w-7xl space-y-8">
	<div class="border-b border-white/10 pb-6">
		<!-- <span -->
		<!-- 	class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase" -->
		<!-- > -->
		<!-- 	<Sparkles class="text-scitech-mint h-4 w-4" /> Dataset Akademik -->
		<!-- </span> -->
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">Angkatan</h1>
	</div>

	<!-- Alert / Toast Notification -->
	{#if showMessage}
		<Message
			status={messageConfig.status}
			title={messageConfig.title}
			message={messageConfig.message}
			dismissible={true}
			timeout={4000}
			onclose={() => (showMessage = false)}
		/>
	{/if}

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
	<!-- 				<h2 class="text-base font-bold text-text-main sm:text-lg"> -->
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
	<!-- 	<!-- Controls Bar -->
	<!-- 	<div class="flex flex-col justify-between gap-4 pt-2 md:flex-row md:items-center"> -->
	<!-- 		<div class="text-text-muted flex items-center gap-2 text-xs font-medium"> -->
	<!-- 			<span>Show</span> -->
	<!-- 			<select -->
	<!-- 				bind:value={entriesPerPage} -->
	<!-- 				class="bg-scitech-navy focus:border-scitech-mint cursor-pointer rounded-xl border border-white/15 px-3 py-1.5 text-text-main transition-colors focus:outline-none" -->
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
	<!-- 				class="bg-scitech-navy/80 placeholder:text-text-muted focus:border-scitech-mint/80 w-full rounded-xl border border-white/15 py-2.5 pr-4 pl-10 text-xs text-text-main transition-all focus:outline-none" -->
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
	<!-- 					class="group-hover:text-scitech-mint p-4 font-mono text-sm font-bold text-text-main transition-colors" -->
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

{#await data.angkatanList}
	<TableSkeleton showTitle={true} title="Memuat Data Kerjasama..." columnsCount={4} />
{:then rawList}
	<TableContent
		title="Data Angkatan Teknologi Informasi"
		addButtonLabel="+ Angkatan"
		data={mapAngkatanToTableContent(rawList)}
		onAdd={() => goto(mergeNewPath('add'))}
		onEdit={(data) => gotoEdit(data.id, page.url.pathname)}
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
	<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
		Gagal memuat data kerjasama: {error.message}
	</div>
{/await}

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
<!--Gak pakek Model lagi ya wkwkw -->
<!-- {#if isModalOpen} -->
<!-- 	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"> -->
<!-- 		<div -->
<!-- 			class="bg-scitech-navy w-full max-w-md space-y-6 rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8" -->
<!-- 		> -->
<!-- 			<div class="flex items-center justify-between border-b border-white/10 pb-4"> -->
<!-- 				<h3 class="text-base font-bold text-text-main"> -->
<!-- 					{isEditMode ? 'Edit Data Angkatan' : 'Tambah Angkatan Baru'} -->
<!-- 				</h3> -->
<!-- 				<button type="button" onclick={closeModal} class="text-text-muted hover:text-text-main"> -->
<!-- 					<X class="h-5 w-5" /> -->
<!-- 				</button> -->
<!-- 			</div> -->
<!---->
<!-- 			<form -->
<!-- 				method="POST" -->
<!-- 				action="?/save" -->
<!-- 				use:enhance={() => { -->
<!-- 					return async ({ result }) => { -->
<!-- 						if (result.type === 'success') { -->
<!-- 							closeModal(); -->
<!-- 						} -->
<!-- 					}; -->
<!-- 				}} -->
<!-- 				class="space-y-4" -->
<!-- 			> -->
<!-- 				<input type="hidden" name="id" value={selectedId} /> -->
<!-- 				<input type="hidden" name="is_edit" value={isEditMode ? 'true' : 'false'} /> -->
<!---->
<!-- 				<div> -->
<!-- 					<label class="mb-1 block text-xs text-text-muted" for="year">Tahun Angkatan</label> -->
<!-- 					<input -->
<!-- 						id="year" -->
<!-- 						name="year" -->
<!-- 						type="number" -->
<!-- 						required -->
<!-- 						bind:value={yearInput} -->
<!-- 						placeholder="Contoh: 2024" -->
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-text-main focus:outline-none" -->
<!-- 					/> -->
<!-- 				</div> -->
<!---->
<!-- 				<div class="flex justify-end gap-3 pt-4"> -->
<!-- 					<button -->
<!-- 						type="button" -->
<!-- 						onclick={closeModal} -->
<!-- 						class="rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold text-text-muted hover:bg-white/10" -->
<!-- 					> -->
<!-- 						Batal -->
<!-- 					</button> -->
<!-- 					<button -->
<!-- 						type="submit" -->
<!-- 						class="text-scitech-navy bg-scitech-mint hover:bg-scitech-mint-hover rounded-xl px-5 py-2 text-xs font-bold" -->
<!-- 					> -->
<!-- 						Simpan -->
<!-- 					</button> -->
<!-- 				</div> -->
<!-- 			</form> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- {/if} -->
