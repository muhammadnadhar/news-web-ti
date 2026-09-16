<script lang="ts">
	import { enhance } from '$app/forms';
	import { Sparkles, X, Save } from 'lucide-svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import type { LecturerPublicationDTO } from '$lib/types/admin/article/penelitian';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import { goto } from '$app/navigation';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { page } from '$app/state';

	let { data } = $props();

	// State Management Modal & Form
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let lecturerNameInput = $state('');
	let sintaLinkInput = $state('');
	let scholarLinkInput = $state('');

	// Sync local state dengan data server
	let publicationList = $derived<TableContentType[]>(data.publicationList || []);
	let rawPublicationList = $derived<LecturerPublicationDTO[]>(data.rawPublicationList || []);

	// Modal Handlers
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		lecturerNameInput = '';
		sintaLinkInput = '';
		scholarLinkInput = '';
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;

		const rawData = rawPublicationList.find((p) => p.id === item.id);
		if (rawData) {
			lecturerNameInput = rawData.lecturer_name;
			sintaLinkInput = rawData.sinta_link || '';
			scholarLinkInput = rawData.scholar_link || '';
		} else {
			const nameCol = item.items.find((col) => col.colomn === 'Nama Dosen');
			const sintaCol = item.items.find((col) => col.colomn === 'Profil SINTA');
			const scholarCol = item.items.find((col) => col.colomn === 'Google Scholar');

			lecturerNameInput = nameCol ? String(nameCol.row) : '';
			sintaLinkInput = sintaCol && sintaCol.row !== '-' ? String(sintaCol.row) : '';
			scholarLinkInput = scholarCol && scholarCol.row !== '-' ? String(scholarCol.row) : '';
		}

		isModalOpen = true;
	}
	/**
	 * Mapper untuk mengonversi data LecturerPublicationDTO dari database
	 * ke format TableContentType yang dibutuhkan oleh komponen TableContent.
	 */
	export function mapLecturerPublicationToTableContent(
		items: LecturerPublicationDTO[]
	): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Nama Dosen',
					row: item.lecturer_name || '-'
				},
				{
					colomn: 'Link SINTA',
					row: item.sinta_link || '-'
				},
				{
					colomn: 'Link Google Scholar',
					row: item.scholar_link || '-'
				}
			]
		}));
	}

	function closeModal() {
		isModalOpen = false;
		selectedId = '';
		lecturerNameInput = '';
		sintaLinkInput = '';
		scholarLinkInput = '';
	}
</script>

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<!-- Header -->
	<div class="border-b border-white/10 pb-6">
		<span
			class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
		>
			<Sparkles class="text-scitech-mint h-4 w-4" /> Penelitian & Pengabdian
		</span>
		<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Publikasi Dosen</h1>
	</div>

	<!-- Component TableContent -->

	{#await data.rawPublicationList}
		<TableSkeleton showTitle={true} title="Memuat Data Publikasi Dosen..." columnsCount={3} />
	{:then rawList}
		<TableContent
			title="Data Publikasi Dosen"
			addButtonLabel="+ Publikasi Dosen"
			data={mapLecturerPublicationToTableContent(rawList)}
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
</div>

<!-- Modal Form CRUD Publikasi Dosen -->
<!-- {#if isModalOpen} -->
<!-- 	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"> -->
<!-- 		<div -->
<!-- 			class="bg-scitech-navy max-h-[90vh] w-full max-w-xl space-y-6 overflow-y-auto rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8" -->
<!-- 		> -->
<!-- 			<div class="flex items-center justify-between border-b border-white/10 pb-4"> -->
<!-- 				<h3 class="text-base font-bold text-white"> -->
<!-- 					{isEditMode ? 'Edit Publikasi Dosen' : 'Tambah Publikasi Dosen'} -->
<!-- 				</h3> -->
<!-- 				<button type="button" onclick={closeModal} class="text-text-muted hover:text-white"> -->
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
<!-- 				class="space-y-5" -->
<!-- 			> -->
<!-- 				<input type="hidden" name="id" value={selectedId} /> -->
<!-- 				<input type="hidden" name="is_edit" value={isEditMode ? 'true' : 'false'} /> -->
<!---->
<!-- 				<!-- Nama Dosen --> -->
<!-- 				<div> -->
<!-- 					<label for="lecturer_name" class="mb-1 block text-xs font-medium text-text-muted"> -->
<!-- 						Nama Dosen & Gelar<span class="text-rose-400">*</span> -->
<!-- 					</label> -->
<!-- 					<input -->
<!-- 						id="lecturer_name" -->
<!-- 						name="lecturer_name" -->
<!-- 						type="text" -->
<!-- 						required -->
<!-- 						bind:value={lecturerNameInput} -->
<!-- 						placeholder="Contoh: Aulia Syarif Aziz, S.Kom., M.Sc" -->
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none" -->
<!-- 					/> -->
<!-- 				</div> -->
<!---->
<!-- 				<!-- Link SINTA --> -->
<!-- 				<div> -->
<!-- 					<label for="sinta_link" class="mb-1 block text-xs font-medium text-text-muted"> -->
<!-- 						Link Profil SINTA -->
<!-- 					</label> -->
<!-- 					<input -->
<!-- 						id="sinta_link" -->
<!-- 						name="sinta_link" -->
<!-- 						type="url" -->
<!-- 						bind:value={sintaLinkInput} -->
<!-- 						placeholder="Contoh: https://sinta.kemdikbud.go.id/authors/detail?id=..." -->
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none" -->
<!-- 					/> -->
<!-- 				</div> -->
<!---->
<!-- 				<!-- Link Google Scholar --> -->
<!-- 				<div> -->
<!-- 					<label for="scholar_link" class="mb-1 block text-xs font-medium text-text-muted"> -->
<!-- 						Link Profil Google Scholar -->
<!-- 					</label> -->
<!-- 					<input -->
<!-- 						id="scholar_link" -->
<!-- 						name="scholar_link" -->
<!-- 						type="url" -->
<!-- 						bind:value={scholarLinkInput} -->
<!-- 						placeholder="Contoh: https://scholar.google.com/citations?user=..." -->
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none" -->
<!-- 					/> -->
<!-- 				</div> -->
<!---->
<!-- 				<!-- Form Action Buttons --> -->
<!-- 				<div class="flex justify-end gap-3 border-t border-white/10 pt-4"> -->
<!-- 					<button -->
<!-- 						type="button" -->
<!-- 						onclick={closeModal} -->
<!-- 						class="rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold text-text-muted hover:bg-white/10" -->
<!-- 					> -->
<!-- 						Batal -->
<!-- 					</button> -->
<!-- 					<button -->
<!-- 						type="submit" -->
<!-- 						class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all" -->
<!-- 					> -->
<!-- 						<Save class="h-4 w-4" /> -->
<!-- 						<span>Simpan</span> -->
<!-- 					</button> -->
<!-- 				</div> -->
<!-- 			</form> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- {/if} -->
