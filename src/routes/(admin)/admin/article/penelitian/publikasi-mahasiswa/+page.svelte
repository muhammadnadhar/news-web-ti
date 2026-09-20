<script lang="ts">
	import { enhance } from '$app/forms';
	import { X, Save } from 'lucide-svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { StudentPublicationDTO } from '$lib/dto/admin/article/penelitian.js';
	import Message from '$lib/components/admin/message.svelte';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';

	let { data } = $props();

	// State Management Modal & Form
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let studentNameInput = $state('');
	let journalListInput = $state('');

	/**
	 * Mapper untuk mengonversi data StudentPublicationDTO dari database
	 * ke format TableContentType yang dibutuhkan oleh komponen TableContent.
	 */
	export function mapStudentPublicationToTableContent(
		items: StudentPublicationDTO[]
	): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Nama Mahasiswa',
					row: item.student_name || '-'
				},
				{
					colomn: 'Daftar Jurnal',
					row: item.journal_list || '-'
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

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedId = '';
		studentNameInput = '';
		journalListInput = '';
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
	<div class="border-b border-white/10 pb-6">
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
			Publikasi Mahasiswa
		</h1>
	</div>

	{#await data.rawPublicationList}
		<TableSkeleton showTitle={true} title="Memuat Data Mahasiswa Prestasi..." columnsCount={2} />
	{:then rawList}
		<TableContent
			title="Data Publikasi Mahasiswa"
			addButtonLabel=" Publikasi Mahasiswa "
			data={mapStudentPublicationToTableContent(rawList)}
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

<!-- Modal Form CRUD Publikasi Mahasiswa -->
{#if isModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
		<div
			class="bg-scitech-navy max-h-[90vh] w-full max-w-3xl space-y-6 overflow-y-auto rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8"
		>
			<div class="flex items-center justify-between border-b border-white/10 pb-4">
				<h3 class="text-base font-bold text-text-main">
					{isEditMode ? 'Edit Publikasi Mahasiswa' : 'Tambah Publikasi Mahasiswa'}
				</h3>
				<button type="button" onclick={closeModal} class="text-text-muted hover:text-text-main">
					<X class="h-5 w-5" />
				</button>
			</div>

			<form
				method="POST"
				action="?/save"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							closeModal();
						}
					};
				}}
				class="space-y-5"
			>
				<input type="hidden" name="id" value={selectedId} />
				<input type="hidden" name="is_edit" value={isEditMode ? 'true' : 'false'} />

				<!-- Nama Mahasiswa -->
				<div>
					<label for="student_name" class="mb-1 block text-xs font-medium text-text-muted">
						Nama Mahasiswa<span class="text-rose-400">*</span>
					</label>
					<input
						id="student_name"
						name="student_name"
						type="text"
						required
						bind:value={studentNameInput}
						placeholder="Contoh: Aulia Sabri"
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-text-main focus:outline-none"
					/>
				</div>

				<!-- Daftar Jurnal (Rich Text / FormEditor) -->
				<div class="space-y-2">
					<label for="journal_list" class="block text-xs font-medium text-text-muted">
						Daftar Jurnal / Artikel<span class="text-rose-400">*</span>
					</label>

					<FormEditor bind:value={journalListInput} />
					<input type="hidden" name="journal_list" value={journalListInput} />
				</div>

				<!-- Form Action Buttons -->
				<div class="flex justify-end gap-3 border-t border-white/10 pt-4">
					<button
						type="button"
						onclick={closeModal}
						class="rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold text-text-muted hover:bg-white/10"
					>
						Batal
					</button>
					<button
						type="submit"
						class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all"
					>
						<Save class="h-4 w-4" />
						<span>Simpan</span>
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
