<script lang="ts">
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import TableSkeleton from '$lib/components/loading/tableSkeleton.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { ResponseMessage } from '$lib/types/message.js';
	import Message from '$lib/components/admin/message.svelte';
	import type { FacilityEntity } from '$lib/dto/admin/article/profile.js';
	import type { TableContentType } from '$lib/types/tableContent.js';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';

	let { data } = $props();

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

	// Mapper dari FacilityEntity ke format yang dapat dibaca TableContent
	function mapFacilityToTableContent(list: FacilityEntity[]): TableContentType[] {
		return list.map((v) => ({
			id: v.id,
			items: [
				{
					colomn: 'Nama Fasilitas',
					row: v.name || '-'
				},
				{ colomn: 'Brand Model', row: v.brand_model || '-' },
				{ colomn: 'Description  Fasilitas', row: v.description, isHtml: true },
				{ colomn: 'SOP', row: v.sop_url, isLink: true },
				{ colomn: 'Terakhir Di Update', row: v.created_at.toString() }
			]
		}));
	}
</script>

<svelte:head>
	<title>Kelola Fasilitas oratorium</title>
</svelte:head>

<!-- alert / toast notification -->
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

<div>
	<!-- Component TableContent dengan Promise Streaming -->
	{#await data.fasilitis}
		<TableSkeleton columnsCount={5} showTitle={true} title="loading data fasilitas laboratorium" />
	{:then rawList}
		<TableContent
			title="Data Fasilitas"
			addButtonLabel="Fasilitas"
			data={mapFacilityToTableContent(rawList.data || [])}
			onAdd={() => goto(mergeNewPath('add'))}
			onEdit={(item) => gotoEdit(item.id, page.url.pathname)}
			deleteAction="?/delete"
			onDeleteSuccess={(res) =>
				triggerMessage(
					res?.status ?? 'success',
					res?.title ?? 'Berhasil',
					res?.message ?? 'Data fasilitas laboratorium berhasil dihapus.'
				)}
			onDeleteError={(res) =>
				triggerMessage(
					res?.status ?? 'error',
					res?.title ?? 'Gagal',
					res?.message ?? 'Gagal menghapus data fasilitas laboratorium.'
				)}
		/>
	{:catch error}
		<div
			class="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-400"
		>
			Gagal memuat data fasilitas laboratorium: {error.message}
		</div>
	{/await}
</div>
