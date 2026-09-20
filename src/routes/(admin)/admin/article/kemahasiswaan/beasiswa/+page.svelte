<script lang="ts">
	import { enhance } from '$app/forms';
	import { Sparkles, X, Save } from 'lucide-svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';

	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
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
	<!-- Header -->
	<div class="border-b border-white/10 pb-6">
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

<!-- <!-- Modal Form CRUD Beasiswa --> -->
<!-- {#if isModalOpen} -->
<!-- 	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"> -->
<!-- 		<div -->
<!-- 			class="bg-scitech-navy max-h-[90vh] w-full max-w-lg space-y-6 overflow-y-auto rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8" -->
<!-- 		> -->
<!-- 			<div class="flex items-center justify-between border-b border-white/10 pb-4"> -->
<!-- 				<h3 class="text-base font-bold text-white"> -->
<!-- 					{isEditMode ? 'Edit Data Beasiswa' : 'Tambah Data Beasiswa'} -->
<!-- 				</h3> -->
<!-- 				<button type="button" onclick={closeModal} class="text-text-muted hover:text-white"> -->
<!-- 					<X class="h-5 w-5" /> -->
<!-- 				</button> -->
<!-- 			</div> -->
<!---->
<!-- 			<form -->
<!-- 				method="POST" -->
<!-- 				action="?/save" -->
<!-- 				use:enhance={() => { -->
<!-- 					return async ({ result }) => { -->
<!-- 						if (result.type === 'success') { -->
<!-- 							closeModal(); -->
<!-- 						} -->
<!-- 					}; -->
<!-- 				}} -->
<!-- 				class="space-y-6" -->
<!-- 			> -->
<!-- 				<input type="hidden" name="id" value={selectedId} /> -->
<!-- 				<input type="hidden" name="is_edit" value={isEditMode ? 'true' : 'false'} /> -->
<!---->
<!-- 				<!-- Nama Mahasiswa --> -->
<!-- 				<div> -->
<!-- 					<label for="student_name" class="text-text-muted mb-1 block text-xs font-medium"> -->
<!-- 						Nama Mahasiswa<span class="text-rose-400">*</span> -->
<!-- 					</label> -->
<!-- 					<input -->
<!-- 						id="student_name" -->
<!-- 						name="student_name" -->
<!-- 						type="text" -->
<!-- 						required -->
<!-- 						bind:value={studentNameInput} -->
<!-- 						placeholder="Contoh: Alfaira Meutia Shaumi Aritonang" -->
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none" -->
<!-- 					/> -->
<!-- 				</div> -->
<!---->
<!-- 				<!-- Jenis Beasiswa --> -->
<!-- 				<div> -->
<!-- 					<label for="scholarship_name" class="text-text-muted mb-1 block text-xs font-medium"> -->
<!-- 						Beasiswa<span class="text-rose-400">*</span> -->
<!-- 					</label> -->
<!-- 					<input -->
<!-- 						id="scholarship_name" -->
<!-- 						name="scholarship_name" -->
<!-- 						type="text" -->
<!-- 						required -->
<!-- 						bind:value={scholarshipNameInput} -->
<!-- 						placeholder="Contoh: Beasiswa Bidikmisi Tahun 2020" -->
<!-- 						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none" -->
<!-- 					/> -->
<!-- 				</div> -->
<!---->
<!-- 				<!-- Form Action Buttons --> -->
<!-- 				<div class="flex justify-end gap-3 pt-4 border-t border-white/10"> -->
<!-- 					<button -->
<!-- 						type="button" -->
<!-- 						onclick={closeModal} -->
<!-- 						class="text-text-muted rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10" -->
<!-- 					> -->
<!-- 						Batal -->
<!-- 					</button> -->
<!-- 					<button -->
<!-- 						type="submit" -->
<!-- 						class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all" -->
<!-- 					> -->
<!-- 						<Save class="h-4 w-4" /> -->
<!-- 						<span>Simpan</span> -->
<!-- 					</button> -->
<!-- 				</div> -->
<!-- 			</form> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- {/if} -->
