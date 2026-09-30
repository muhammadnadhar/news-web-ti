<script lang="ts">
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { TableContentType } from '$lib/types/tableContent.js';
	import type { OrgStructureItemDTO } from '$lib/dto/admin/article/profile.js';
	import TableSkeleton from '$lib/components/loading/tableSkeleton.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message.js';

	let { data } = $props();

	// State untuk Search dan Pagination
	let searchQuery = $state('');
	let entriesPerPage = $state(10);
	let currentPage = $state(1);

	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});
	// Function Mapper: Mengubah DTO dari Database ke format TableContentType
	function mapToTableContent(items: OrgStructureItemDTO[]): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{ colomn: 'Foto', row: item.image_url || '-', isImage: true },
				{ colomn: 'Judul', row: item.title },
				{ colomn: 'Deskripsi', row: item.description || '-', isHtml: true }
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

	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

</script>

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


<div class="space-y-6 p-6 lg:p-10">
	<div class="border-scitech-slate/20 pb-4">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Dosen & Staff</h1>
	</div>


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


</div>
