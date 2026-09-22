<script lang="ts">
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import { page } from '$app/state';
	import Message from '$lib/components/admin/message.svelte';
	import type { PartnershipDTO } from '$lib/dto/admin/article/kerjasama.js';
	import type { ResponseMessage } from '$lib/types/message.js';

	let { data } = $props();

	// State Management Modal & Form

	// Sync local state dengan data server
	// let partnershipList = $derived<TableContentType[]>(data.partnershipList || []);
	// let rawPartnershipList = $derived<PartnershipDTO[]>(data.rawPartnershipList || []);

	/**
	 * Mapper untuk mengonversi data PartnershipDTO dari database
	 * ke format TableContentType yang dibutuhkan oleh komponen TableContent
	 */
	export function mapPartnershipToTableContent(items: PartnershipDTO[]): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Logo Instansi',
					row: item.logo_url || '-',
					isImage: true
				},
				{
					colomn: 'Nama Instansi',
					row: item.institution_name
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

{#if showMessage}
	<div class="mb-6">
		<Message
			status={messageConfig.status}
			title={messageConfig.title}
			message={messageConfig.message}
			dismissible={true}
			timeout={5000}
			onclose={() => (showMessage = false)}
		/>
	</div>
{/if}

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<!-- Header -->
	<div class="border-b border-white/10 pb-6">
		<!-- <span -->
		<!-- 	class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase" -->
		<!-- > -->
		<!-- 	<Sparkles class="text-scitech-mint h-4 w-4" /> Kerjasama -->
		<!-- </span> -->
		<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Daftar Kerjasama</h1>
	</div>

	<!-- Component TableContent -->
	{#await data.rawPartnershipList}
		<TableSkeleton showTitle={true} title="Memuat Data Kerjasama..." columnsCount={4} />
	{:then rawList}
		<TableContent
			title="Daftar Kerjasama"
			addButtonLabel="Kerjasama"
			data={mapPartnershipToTableContent(rawList)}
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

<!-- Modal Form CRUD Daftar Kerjasama -->
<!-- {#if isModalOpen} -->
<!-- 	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"> -->
<!-- 		<div -->
<!-- 			class="bg-scitech-navy max-h-[90vh] w-full max-w-xl space-y-6 overflow-y-auto rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8" -->
<!-- 		> -->
<!-- 			<div class="flex items-center justify-between border-b border-white/10 pb-4"> -->
<!-- 				<h3 class="text-base font-bold text-white"> -->
<!-- 					{isEditMode ? 'Edit Data Kerjasama' : 'Tambah Data Kerjasama'} -->
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
<!-- 				<div> -->
<!-- 					<label for="institution_name" class="mb-1 block text-xs font-medium text-text-muted"> -->
<!-- 						Nama Instansi / Mitra<span class="text-rose-400">*</span> -->
<!-- 					</label> -->
<!-- 					<input -->
<!-- 						id="institution_name" -->
<!-- 						name="institution_name" -->
<!-- 						type="text" -->
<!-- 						required -->
<!-- 						bind:value={institutionNameInput} -->
<!-- 						placeholder="Contoh: Bank Indonesia" -->
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none" -->
<!-- 					/> -->
<!-- 				</div> -->
<!---->
<!-- 				<div> -->
<!-- 					<label for="logo_url" class="mb-1 block text-xs font-medium text-text-muted"> -->
<!-- 						URL / Path Logo Instansi -->
<!-- 					</label> -->
<!-- 					<input -->
<!-- 						id="logo_url" -->
<!-- 						name="logo_url" -->
<!-- 						type="text" -->
<!-- 						bind:value={logoUrlInput} -->
<!-- 						placeholder="Contoh: /images/partners/bank-indonesia.png" -->
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none" -->
<!-- 					/> -->
<!-- 				</div> -->
<!---->
<!-- 				{#if logoUrlInput} -->
<!-- 					<div class="space-y-1"> -->
<!-- 						<span class="block text-xs font-medium text-text-muted">Preview Logo:</span> -->
<!-- 						<div class="flex h-20 w-20 items-center justify-center rounded-xl bg-white p-2"> -->
<!-- 							<img -->
<!-- 								src={logoUrlInput} -->
<!-- 								alt="Preview Logo" -->
<!-- 								class="max-h-full max-w-full object-contain" -->
<!-- 							/> -->
<!-- 						</div> -->
<!-- 					</div> -->
<!-- 				{/if} -->
<!---->
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
