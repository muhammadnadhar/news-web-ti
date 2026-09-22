<script lang="ts">
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { ResponseMessage } from '$lib/types/message.js';
	import Message from '$lib/components/admin/message.svelte';
	import type { PedomanTaDTO } from '$lib/dto/admin/article/akademik.js';

	let { data } = $props();

	// State Management
	let searchQuery = $state('');
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let titleInput = $state('');
	let descriptionContent = $state('');
	let currentImageUrl = $state<string | null>(null);

	// Sync local state
	let pedomanList = $derived<TableContentType[]>(data.pedomanList || []);
	let rawPedomanList = $derived<PedomanTaDTO[]>(data.rawPedomanList || []);
	/**
	 * Mengubah list PedomanTaDTO menjadi format TableContentType
	 */
	export function mapPedomanTaToTableContent(dataList: PedomanTaDTO[]): TableContentType[] {
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

	// Filtered Data untuk TableContent
	let filteredList = $derived(
		pedomanList.filter((item) =>
			item.items.some((col) => String(col.row).toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	// Modal Handlers
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		titleInput = '';
		descriptionContent = '';
		currentImageUrl = null;
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;

		const rawData = rawPedomanList.find((p) => p.id === item.id);
		if (rawData) {
			titleInput = rawData.title;
			descriptionContent = rawData.description || '';
			currentImageUrl = rawData.image_url;
		} else {
			const titleCol = item.items.find((col) => col.colomn === 'Judul');
			const descCol = item.items.find((col) => col.colomn === 'Description');
			titleInput = titleCol ? String(titleCol.row) : '';
			descriptionContent = descCol ? String(descCol.row) : '';
			currentImageUrl = null;
		}

		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedId = '';
		titleInput = '';
		descriptionContent = '';
		currentImageUrl = null;
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
	<!-- Header -->
	<div class="border-b border-white/10 pb-6">
		<!-- <span -->
		<!-- 	class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase" -->
		<!-- > -->
		<!-- 	<Sparkles class="text-scitech-mint h-4 w-4" /> Artikel Akademik -->
		<!-- </span> -->
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">Pedoman TA</h1>
	</div>

	<!-- Component TableContent -->

	<!-- Component TableContent -->
	{#await data.pedomanList}
		<TableSkeleton showTitle={true} title="Memuat Data Kerjasama..." columnsCount={2} />
	{:then rawList}
		<TableContent
			title="Data Pedoman Tugas Akhir"
			addButtonLabel="+ Pedoman Tugas Akhir"
			data={mapPedomanTaToTableContent(rawList)}
			onAdd={() => goto(mergeNewPath('add'))}
			onEdit={(data) => gotoEdit(data.id, page.url.pathname)}
			deleteAction="?/delete"
			onDeleteSuccess={(res) =>
				triggerMessage(
					res?.status ?? 'success',
					res?.title ?? 'Berhasil',
					res?.message ?? 'Data dokumentasi berhasil dihapus.'
				)}
			onDeleteError={(res) =>
				triggerMessage(
					res?.status ?? 'error',
					res?.title ?? 'Gagal',
					res?.message ?? 'Gagal menghapus data dokumentasi.'
				)}
		/>
	{:catch error}
		<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
			Gagal memuat data kerjasama: {error.message}
		</div>
	{/await}
</div>
