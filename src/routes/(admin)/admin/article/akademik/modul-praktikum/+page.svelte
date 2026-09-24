<script lang="ts">
	import { Sparkles, X, Upload, Save } from 'lucide-svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';
	import type { PracticumModuleDTO } from '$lib/dto/admin/article/akademik.js';

	let { data } = $props();

	// State Management
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let titleInput = $state('');
	let descriptionContent = $state('');
	let currentImageUrl = $state<string | null>(null);

	/**
	 * Mengubah list PracticumModuleDTO menjadi format TableContentType
	 */
	export function mapPracticumModuleToTableContent(
		dataList: PracticumModuleDTO[]
	): TableContentType[] {
		if (!Array.isArray(dataList)) return [];

		return dataList.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Judul Modul',
					row: item.title || '-'
				},
				{
					colomn: 'Gambar',
					row: item.image_url || '/placeholder.png',
					isImage: true
				},
				{
					colomn: 'Deskripsi',
					row: item.description || '-',
					isHtml: true
				},
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

	// Sync local state
	let moduleList = $derived<TableContentType[]>(data.moduleList || []);
	let rawModuleList = $derived<PracticumModuleDTO[]>(data.rawModuleList || []);

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

		const rawData = rawModuleList.find((p) => p.id === item.id);
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
	let showMessage = $state(false);

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

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<div class="border-b border-white/10 pb-6">
		<!-- <span -->
		<!-- 	class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase" -->
		<!-- > -->
		<!-- 	<Sparkles class="text-scitech-mint h-4 w-4" /> Artikel Akademik -->
		<!-- </span> -->
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
			Modul Praktikum
		</h1>
	</div>

	<!-- Component TableContent -->
	{#await data.rawModuleList}
		<TableSkeleton showTitle={true} title="Memuat Data Kerjasama..." columnsCount={2} />
	{:then rawList}
		<TableContent
			title="Data Modul Praktikum"
			addButtonLabel="+ Modul Praktikum"
			data={mapPracticumModuleToTableContent(rawList)}
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
