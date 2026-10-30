<script lang="ts">
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import TableSkeleton from '$lib/components/loading/tableSkeleton.svelte';
	import { formatDate, gotoEdit, mergeNewPath } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PedomanKkpDTO } from '$lib/dto/admin/article/akademik.js';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';
	import Message from '$lib/components/notif/message.svelte';

	let { data } = $props();

	let showMessage = $state(false);

	/**
	 * Mengubah list PedomanKkpDTO menjadi format TableContentType
	 */
	export function mapPedomanKkpToTableContent(dataList: PedomanKkpDTO[]): TableContentType[] {
		if (!Array.isArray(dataList)) return [];

		return dataList.map((item) => ({
			id: item.id,
			items: [
				{ colomn: 'Judul Pedoman', row: item.title || '-' },
				{ colomn: 'Gambar', row: item.image_url || '/placeholder.png', isImage: true },
				{ colomn: 'Deskripsi', row: item.description || '-', isHtml: true },
				{
					colomn: 'Tanggal Dibuat',
					row: item.created_at
						?	formatDate(item.created_at)		: '-'
				}
			]
		}));
	}

	// Sync local state

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}
</script>

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

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<div class="border-b border-white/10 pb-6">
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">Pedoman KKP</h1>
	</div>

	{#await data.rawPedomanList}
		<TableSkeleton rowCount={2} columnsCount={4} />
	{:then rawList}
		<TableContent
			title="Data Pedoman Kuliah Kerja Praktek"
			addButtonLabel="+ Pedoman KKP"
			data={mapPedomanKkpToTableContent(rawList)}
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
