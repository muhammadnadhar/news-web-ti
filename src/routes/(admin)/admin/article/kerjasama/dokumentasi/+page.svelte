<script lang="ts">
	import { Sparkles, X, Save, CameraIcon, AlertCircle } from 'lucide-svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import { gotoEdit, mergeNewPath } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { ResponseMessage } from '$lib/types/message.js';
	import Message from '$lib/components/admin/message.svelte';
	import type { ActivityDocumentationDTO } from '$lib/dto/admin/article/kerjasama.js';
	import TableSkeleton from '$lib/components/loading/tableSkeleton.svelte';

	let { data } = $props();

	// State Management Modal & Form
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let titleInput = $state('');
	let imageUrlInput = $state('');
	let descriptionInput = $state('');
	let eventDateInput = $state('');

	// Sync local state dengan data server
	//let documentationList = $derived<TableContentType[]>(data.documentationList || []);
	// let rawDocumentationList = $derived<ActivityDocumentationDTO[]>(data.rawDocumentationList || []);

	function mapToTableContent(items: ActivityDocumentationDTO[]): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{ colomn: 'Gambar', row: item.image_url || '-', isImage: true },
				{ colomn: 'Nama', row: item.title },
				{
					colomn: 'Tanggal Event',
					row: item.event_date
						? new Date(item.event_date).toLocaleDateString('id-ID', {
								day: 'numeric',
								month: 'long',
								year: 'numeric'
							})
						: '-'
				},
				{ colomn: 'Deskripsi', row: item.description || '-', isHtml: true }
			]
		}));
	}

	// Modal Handlers
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		titleInput = '';
		imageUrlInput = '';
		descriptionInput = '';
		eventDateInput = '';
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;

		const rawData = rawDocumentationList.find((d) => d.id === item.id);
		if (rawData) {
			titleInput = rawData.title;
			imageUrlInput = rawData.image_url;
			descriptionInput = rawData.description || '';
			eventDateInput = rawData.event_date
				? new Date(rawData.event_date).toISOString().split('T')[0]
				: '';
		} else {
			const nameCol = item.items.find((col) => col.colomn === 'Nama');
			titleInput = nameCol ? String(nameCol.row) : '';
			imageUrlInput = '';
			descriptionInput = '';
			eventDateInput = '';
		}

		isModalOpen = true;
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

	function closeModal() {
		isModalOpen = false;
		selectedId = '';
		titleInput = '';
		imageUrlInput = '';
		descriptionInput = '';
		eventDateInput = '';
	}
</script>

<svelte:head>
	<title>Dokumentasi Kegiatan | Admin SciTech</title>
</svelte:head>

<div class="mx-auto max-w-7xl space-y-6">
	<div class="flex items-center justify-between border-b border-white/10 pb-4">
		<div class="flex items-center gap-3">
			<div
				class="border-scitech-mint/20 bg-scitech-mint/10 text-scitech-mint rounded-xl border p-2.5"
			>
				<CameraIcon class="h-6 w-6" />
			</div>
			<div>
				<div class="flex items-center gap-2">
					<!-- <span -->
					<!-- 	class="text-scitech-mint inline-flex items-center gap-1 text-xs font-semibold tracking-wider uppercase" -->
					<!-- > -->
					<!-- 	<Sparkles class="h-3.5 w-3.5" /> Media & Galeri -->
					<!-- </span> -->
				</div>
				<h1 class="text-scitech-mint text-lg font-bold tracking-wide sm:text-xl">
					Dokumentasi Kegiatan
				</h1>
				<p class="text-xs text-text-muted">
					Kelola arsip foto, berita, dan album dokumentasi seluruh kegiatan akademis.
				</p>
			</div>
		</div>
	</div>

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

	<!-- Component TableContent dengan Loading & Error State -->
	{#await data.documentationList}
		<TableSkeleton columnsCount={4} showTitle={true} title="Memuat data dokumentasi kegiatan..." />
	{:then docList}
		<TableContent
			title="Daftar Dokumentasi Kegiatan"
			addButtonLabel="Tambah Dokumentasi"
			data={mapToTableContent(docList)}
			onAdd={() => goto(mergeNewPath('add'))}
			onEdit={(item) => gotoEdit(item.id, page.url.pathname)}
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
		<div
			class="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-400 backdrop-blur-xl"
		>
			<AlertCircle class="h-5 w-5 shrink-0 text-red-400" />
			<span>Gagal memuat data dokumentasi: {error.message}</span>
		</div>
	{/await}
</div>
