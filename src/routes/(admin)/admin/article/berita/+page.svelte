<script lang="ts">
	import type { PageData } from './$types';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import type { NewsItemDTO } from '$lib/dto/admin/article/berita';
	import TableSkeleton from '$lib/components/loading/tableSkeleton.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { formatDate, gotoEdit } from '$lib/utils';
	import Message from '$lib/components/notif/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';

	let { data }: { data: PageData } = $props();

	/**
	 * Helper untuk mengubah array NewsItemDTO ke format TableContentType
	 */
	function mapNewsToTableContent(items: NewsItemDTO[] = []): TableContentType[] {
		return items.map((item) => {
			return {
				id: item.id,
				items: [
					{
						colomn: 'Judul Berita',
						row: item.title || '-',
						isHtml: false
					},

					{
						colomn: 'priview',
						row: item.image_url,
						isImage: true
					},
					// Description terlalu panjang , jadi matikan aja
					//	{
					//		colomn: 'Description',
					//		row: item.content || '-',
					//			isHtml: true
					//		},
					{
						colomn: 'Kategori',
						row: item.category_name || '-',
						isHtml: false
					},
					{
						colomn: 'Tanggal Publikasi',
						row: formatDate(item.published_at),
						isHtml: false
					}
				]
			};
		});
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

	// Menambahkan URL ke route /add
	function handleAdd() {
		goto(`${page.url.pathname}/add`);
	}
</script>

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

<div class="min-h-screen bg-bg-primary p-6 text-text-main transition-colors">
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-text-main">Berita</h1>
			<p class="mt-1 text-sm text-text-muted">
				Kelola daftar berita, seminar, dan pengumuman prodi.
			</p>
		</div>
	</div>

	{#await data.news}
		<TableSkeleton rowCount={3} columnsCount={4} />
	{:then rawList}
		<TableContent
			title="Daftar Berita"
			addButtonLabel="Tambah Berita"
			data={mapNewsToTableContent(rawList)}
			onAdd={handleAdd}
			onEdit={(item) => gotoEdit(item.id, page.url.pathname)}
			deleteAction="?/delete"
			onDeleteSuccess={(res) =>
				triggerMessage(
					res?.status ?? 'success',
					res?.title ?? 'Berhasil',
					res?.message ?? 'Data berita berhasil dihapus.'
				)}
			onDeleteError={(res) =>
				triggerMessage(
					res?.status ?? 'error',
					res?.title ?? 'Gagal',
					res?.message ?? 'Gagal menghapus data berita.'
				)}
		/>
	{:catch error}
		<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
			Gagal memuat data: {error.message}
		</div>
	{/await}
</div>
