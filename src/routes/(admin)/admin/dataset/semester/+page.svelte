<script lang="ts">
	import { Sparkles } from 'lucide-svelte';

	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import { goto } from '$app/navigation';
	import { gotoEdit, mergeNewPath } from '$lib/utils';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import { page } from '$app/state';
	import type { SemesterDTO } from '$lib/types/admin/dataset.js';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';

	let { data } = $props();

	/**
	 * Mapper untuk mengonversi data SemesterDTO dari database
	 * ke format TableContentType yang dibutuhkan oleh komponen TableContent.
	 */
	function mapSemesterToTableContent(items: SemesterDTO[]): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Nama Semester',
					row: item.name
				},
				{
					colomn: 'Tahun Akademik',
					row: item.academic_year
				},
				{
					colomn: 'Status',
					row: item.is_active ? 'Aktif' : 'Tidak Aktif'
				}
			]
		}));
	}

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});
	let showMessage = $state(false);

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
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
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">Semester</h1>
	</div>

	<!-- Main Table Container Card -->
	<!-- <div -->
	<!-- 	class="bg-scitech-slate/60 space-y-6 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8" -->
	<!-- > -->
	<!-- Data Table -->
	{#await data.rawSmtList}
		<TableSkeleton showTitle={true} title="Memuat Data Kerjasama..." columnsCount={4} />
	{:then rawList}
		<TableContent
			title="Daftar Semester"
			addButtonLabel="Add Semester"
			data={mapSemesterToTableContent(rawList)}
			onAdd={() => goto(mergeNewPath('add'))}
			onEdit={(data) => gotoEdit(data.id, page.url.pathname)}
			deleteAction="?/delete"
			onDeleteSuccess={(res) =>
				triggerMessage(
					res?.status ?? 'success',
					res?.title ?? 'Berhasil',
					res?.message ?? 'Data berhasil dihapus.'
				)}
			onDeleteError={(res) =>
				triggerMessage(
					res.status ?? 'error',
					res?.title ?? 'Gagal Menyimpan',
					res?.message ?? 'Terjadi kesalahan saat menghapus data.'
				)}
		/>
	{:catch error}
		<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
			Gagal memuat data kerjasama: {error.message}
		</div>
	{/await}
</div>

<!-- </div> -->

<!-- Modal Tambah Semester -->
<!-- {#if isAddModalOpen} -->
<!-- 	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"> -->
<!-- 		<div -->
<!-- 			class="bg-scitech-navy w-full max-w-md space-y-6 rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8" -->
<!-- 		> -->
<!-- 			<div class="flex items-center justify-between border-b border-white/10 pb-4"> -->
<!-- 				<h3 class="text-base font-bold text-text-main">Tambah Semester Baru</h3> -->
<!-- 				<button onclick={() => (isAddModalOpen = false)} class="text-text-muted hover:text-text-main" -->
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
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-text-main focus:outline-none" -->
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
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-text-main focus:outline-none" -->
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
