<script lang="ts">

	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import TableSkeleton from '$lib/components/loading/tableSkeleton.svelte';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { StudentAchievementDTO } from '$lib/dto/admin/article/kemahasiswaan.js';
	import Message from '$lib/components/admin/message.svelte';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';

	let { data } = $props();

	// State Management Modal & Form
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let studentNameInput = $state('');
	let isAcademicInput = $state<'y' | 'n'>('y');
	let batchYearInput = $state('');
	let semesterInput = $state('');
	let achievementNameInput = $state('');

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});
	let showMessage = $state(false);

	// Sync local state dengan data server
	/**
	 * Mapper untuk mengonversi data StudentAchievementDTO dari database
	 * ke format TableContentType yang dibutuhkan oleh komponen TableContent
	 */
	export function mapStudentAchievementToTableContent(
		items: StudentAchievementDTO[]
	): TableContentType[] {
		if (!Array.isArray(items)) return [];

		return items.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Nama Mahasiswa',
					row: item.student_name
				},
				{
					colomn: 'Nama Prestasi',
					row: item.achievement_name
				},
				{
					colomn: 'Kategori',
					row: item.is_academic === 'y' ? 'Akademik' : 'Non-Akademik'
				},
				{
					colomn: 'Angkatan',
					row: item.batch_year
				},
				{
					colomn: 'Semester',
					row: item.semester
				}
			]
		}));
	}

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	// Modal Handlers
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		studentNameInput = '';
		isAcademicInput = 'y';
		batchYearInput = '';
		semesterInput = '';
		achievementNameInput = '';
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;

		const rawData = rawAchievementList.find((s) => s.id === item.id);
		if (rawData) {
			studentNameInput = rawData.student_name;
			isAcademicInput = rawData.is_academic;
			batchYearInput = rawData.batch_year;
			semesterInput = rawData.semester;
			achievementNameInput = rawData.achievement_name;
		} else {
			const nameCol = item.items.find((col) => col.colomn === 'Nama');
			const batchCol = item.items.find((col) => col.colomn === 'Angkatan');
			const semCol = item.items.find((col) => col.colomn === 'Semester');
			const achCol = item.items.find((col) => col.colomn === 'Prestasi');

			studentNameInput = nameCol ? String(nameCol.row) : '';
			batchYearInput = batchCol ? String(batchCol.row) : '';
			semesterInput = semCol ? String(semCol.row) : '';
			achievementNameInput = achCol ? String(achCol.row) : '';
			isAcademicInput = 'y';
		}

		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedId = '';
		studentNameInput = '';
		isAcademicInput = 'y';
		batchYearInput = '';
		semesterInput = '';
		achievementNameInput = '';
	}
</script>

{#if showMessage}
	<div class="mb-6">
		<Message
			status={messageConfig.status}
			title={messageConfig.title}
			message={messageConfig.message}
			dismissible={true}
			timeout={5000}
			onclose={() => (showMessage = false)}
		/>
	</div>
{/if}

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<!-- Header -->
	<div class="border-b border-white/10 pb-6">
		<!-- <span -->
		<!-- 	class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase" -->
		<!-- > -->
		<!-- 	<Sparkles class="text-scitech-mint h-4 w-4" /> Kemahasiswaan -->
		<!-- </span> -->
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
			Mahasiswa Prestasi
		</h1>
	</div>

	<!-- Component TableContent -->

	{#await data.rawAchievementList}
		<TableSkeleton showTitle={true} title="Memuat Data Mahasiswa Prestasi..." columnsCount={4} />
	{:then rawList}
		<TableContent
			title="Data Mahasiswa Prestasi"
			addButtonLabel=" Mahasiswa Prestasi"
			data={mapStudentAchievementToTableContent(rawList)}
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
