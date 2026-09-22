<script lang="ts">
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import { goto } from '$app/navigation';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { page } from '$app/state';
	import type { LecturerPublicationDTO } from '$lib/dto/admin/article/penelitian.js';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';

	let { data } = $props();

	// State Management Modal & Form
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let lecturerNameInput = $state('');
	let sintaLinkInput = $state('');
	let scholarLinkInput = $state('');

	let showMessage = $state(false);
	// Sync local state dengan data server

	let rawPublicationList = $derived<LecturerPublicationDTO[]>(data.rawPublicationList || []);

	// Modal Handlers
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		lecturerNameInput = '';
		sintaLinkInput = '';
		scholarLinkInput = '';
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;

		const rawData = rawPublicationList.find((p) => p.id === item.id);
		if (rawData) {
			lecturerNameInput = rawData.lecturer_name;
			sintaLinkInput = rawData.sinta_link || '';
			scholarLinkInput = rawData.scholar_link || '';
		} else {
			const nameCol = item.items.find((col) => col.colomn === 'Nama Dosen');
			const sintaCol = item.items.find((col) => col.colomn === 'Profil SINTA');
			const scholarCol = item.items.find((col) => col.colomn === 'Google Scholar');

			lecturerNameInput = nameCol ? String(nameCol.row) : '';
			sintaLinkInput = sintaCol && sintaCol.row !== '-' ? String(sintaCol.row) : '';
			scholarLinkInput = scholarCol && scholarCol.row !== '-' ? String(scholarCol.row) : '';
		}

		isModalOpen = true;
	}
	/**
	 * Mapper untuk mengonversi data LecturerPublicationDTO dari database
	 * ke format TableContentType yang dibutuhkan oleh komponen TableContent.
	 */
	export function mapLecturerPublicationToTableContent(
		items: LecturerPublicationDTO[]
	): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Nama Dosen',
					row: item.lecturer_name || '-'
				},
				{
					colomn: 'Link SINTA',
					row: item.sinta_link || '-'
				},
				{
					colomn: 'Link Google Scholar',
					row: item.scholar_link || '-'
				}
			]
		}));
	}

	function closeModal() {
		isModalOpen = false;
		selectedId = '';
		lecturerNameInput = '';
		sintaLinkInput = '';
		scholarLinkInput = '';
	}

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
		<!-- 	<span -->
		<!-- 		class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase" -->
		<!-- 	> -->
		<!-- 		<Sparkles class="text-scitech-mint h-4 w-4" /> Penelitian & Pengabdian -->
		<!-- 	</span> -->
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
			Publikasi Dosen
		</h1>
	</div>

	<!-- Component TableContent -->

	{#await data.rawPublicationList}
		<TableSkeleton showTitle={true} title="Memuat Data Publikasi Dosen..." columnsCount={3} />
	{:then rawList}
		<TableContent
			title="Data Publikasi Dosen"
			addButtonLabel="+ Publikasi Dosen"
			data={mapLecturerPublicationToTableContent(rawList)}
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
