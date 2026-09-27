<script lang="ts">
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import TableSkeleton from '$lib/components/loading/tableSkeleton.svelte';
	import type { ResponseMessage } from '$lib/types/message.js';
	import Message from '$lib/components/admin/message.svelte';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { ScholarshipDTO } from '$lib/dto/admin/article/kemahasiswaan.js';

	let { data } = $props();

	// State Management Modal & Form
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let studentNameInput = $state('');
	let scholarshipNameInput = $state('');

	// Sync local state dengan data dari server
	let scholarshipList = $derived<TableContentType[]>(data.scholarshipList || []);
	let rawScholarshipList = $derived<ScholarshipDTO>(data.rawScholarshipList || []);

	/**
	 * Mapper untuk mengonversi data ScholarshipDTO dari database
	 * ke format TableContentType yang dibutuhkan oleh komponen TableContent.
	 */
	export function mapScholarshipToTableContent(items: ScholarshipDTO[]): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Nama Mahasiswa',
					row: item.student_name || '-'
				},
				{
					colomn: 'Nama Beasiswa',
					row: item.scholarship_name || '-'
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

	// Modal Handlers
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		studentNameInput = '';
		scholarshipNameInput = '';
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;

		const rawData = rawScholarshipList.find((s) => s.id === item.id);
		if (rawData) {
			studentNameInput = rawData.student_name;
			scholarshipNameInput = rawData.scholarship_name;
		} else {
			const nameCol = item.items.find((col) => col.colomn === 'Nama');
			const beasiswaCol = item.items.find((col) => col.colomn === 'Beasiswa');
			studentNameInput = nameCol ? String(nameCol.row) : '';
			scholarshipNameInput = beasiswaCol ? String(beasiswaCol.row) : '';
		}

		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedId = '';
		studentNameInput = '';
		scholarshipNameInput = '';
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
	<div class=" pb-6">
		<!-- <span -->
		<!-- 	class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase" -->
		<!-- > -->
		<!-- 	<Sparkles class="text-scitech-mint h-4 w-4" /> Kemahasiswaan -->
		<!-- </span> -->
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">Beasiswa</h1>
	</div>

	<!-- Component TableContent -->
	<!-- <TableContent -->
	<!-- 	title="Data Beasiswa" -->
	<!-- 	addButtonLabel="+ Beasiswa" -->
	<!-- 	data={scholarshipList} -->
	<!-- 	onAdd={openAddModal} -->
	<!-- 	onEdit={openEditModal} -->
	<!-- /> -->
	{#await data.rawScholarshipList}
		<TableSkeleton columnsCount={4} showTitle={true} title={'loading data ipk tertinggi'} />
	{:then rawList}
		<TableContent
			title="Beasiswa "
			addButtonLabel="Beasiswa"
			data={mapScholarshipToTableContent(rawList)}
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
		<div
			class="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-400"
		>
			Gagal memuat data dokumentasi: {error.message}
		</div>
	{/await}
</div>
