<script lang="ts">
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PartnershipDTO } from '$lib/dto/admin/article/kerjasama.js';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';
	import TableSkeleton from '$lib/components/loading/tableSkeleton.svelte';
	import Message from '$lib/components/notif/message.svelte';

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
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">Daftar Kerjasama</h1>
	</div>

	<!-- Component TableContent -->
	{#await data.rawPartnershipList}
		<TableSkeleton  rowCount={3} columnsCount={4} />
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

