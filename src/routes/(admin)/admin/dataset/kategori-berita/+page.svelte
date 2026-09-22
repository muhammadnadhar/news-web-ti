<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Message from '$lib/components/admin/message.svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import type { NewsCategoryDTO } from '$lib/dto/admin/dataset.js';
	import type { ResponseMessage } from '$lib/types/message.js';
	import type { TableContentType } from '$lib/types/tableContent.js';

	let { data } = $props(); // Svelte 5 Runes (jika Svelte 4: export let data;)

	function handleAdd() {
		goto(`${page.url.pathname}/add`);
	}

	function gotoEdit(id: string | number, currentPath: string) {
		goto(`${currentPath}/edit/${id}`);
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



/**
 * Helper untuk mengubah array NewsCategoryDTO ke format TableContentType
 */
export function mapNewsCategoryToTableContent(items: NewsCategoryDTO[] = []): TableContentType[] {
	if (!items || !Array.isArray(items)) {
		return [];
	}

	return items.map((item) => ({
		id: item.id,
		items: [
			{
				colomn: 'Nama Kategori',
				row: item.name || '-',
				isHtml: false
			},
			{
				colomn: 'Slug',
				row: item.slug || '-',
				isHtml: false
			}
		]
	}));
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


<div class="min-h-screen bg-bg-primary p-6 text-[var(--color-text-main)] transition-colors">
	<!-- Header Page -->
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">Kategori Berita</h1>
			<p class="mt-1 text-sm text-text-muted">
				Kelola daftar kategori untuk berita dan pengumuman prodi.
			</p>
		</div>
	</div>

	<!-- Table Content / Area Tabel -->
	{#await data.categories}
		<TableSkeleton showTitle={true} title="Memuat Data Kategori Berita..." columnsCount={3} />
	{:then rawList}
		<TableContent
			title="Daftar Kategori Berita"
			addButtonLabel="Tambah Kategori"
			data={mapNewsCategoryToTableContent(rawList)}
			onAdd={handleAdd}
			onEdit={(item) => gotoEdit(item.id, page.url.pathname)}
			deleteAction="?/delete"
			onDeleteSuccess={(res) =>
				triggerMessage(
					res?.status ?? 'success',
					res?.title ?? 'Berhasil',
					res?.message ?? 'Data kategori berita berhasil dihapus.'
				)}
			onDeleteError={(res) =>
				triggerMessage(
					res?.status ?? 'error',
					res?.title ?? 'Gagal',
					res?.message ?? 'Gagal menghapus data kategori berita.'
				)}
		/>
	{:catch error}
		<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
			Gagal memuat data: {error.message}
		</div>
	{/await}
</div>
