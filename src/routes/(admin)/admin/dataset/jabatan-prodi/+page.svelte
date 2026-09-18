<script lang="ts">
	import { enhance } from '$app/forms';
	import { Briefcase, Plus, Edit2, Trash2, X, Check, Loader2 } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message';
	import type { JabatanProdiDTO } from '$lib/types/admin/dataset';
	import type { TableContentType } from '$lib/types/tableContent';
	import { goto } from '$app/navigation';
	import { gotoEdit, mergeNewPath } from '$lib/utils';
	import { page } from '$app/state';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();

	let searchValue = $state('');
	let isSubmitting = $state(false);

	// Modal State
	let showModal = $state(false);
	let modalMode = $state<'create' | 'edit'>('create');
	let activeId = $state('');
	let activeName = $state('');

	// Filtered items berdasarkan input pencarian
	let filteredPositions = $derived(
		data.positions.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase()))
	);

	const headers = [{ key: 'name', label: 'Nama Jabatan Prodi' }];

	function openCreateModal() {
		modalMode = 'create';
		activeId = '';
		activeName = '';
		showModal = true;
	}

	function openEditModal(item: { id: string; name: string }) {
		modalMode = 'edit';
		activeId = item.id;
		activeName = item.name;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		activeId = '';
		activeName = '';
	}
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});
	let showMessage = $state(false);

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	function mapJabatanToTableContent(items: JabatanProdiDTO[]): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{ colomn: 'nama jabatan ', row: item.name },
				{ colomn: 'Tanggal DI buat ', row: item.created_at }
			]
		}));
	}
</script>

<svelte:head>
	<title>Kelola Jabatan Prodi - Admin Portal</title>
</svelte:head>

<div class="min-h-screen bg-[var(--color-bg-primary)] p-4 text-[var(--color-text-main)] md:p-8">
	<div class="mx-auto max-w-5xl space-y-6">
		<!-- Header Section -->
		<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="flex items-center gap-2 text-xl font-bold text-[var(--color-text-main)]">
					<Briefcase class="h-6 w-6 text-[var(--color-accent-primary)]" />
					<span>Master Jabatan Prodi</span>
				</h1>
				<p class="text-xs text-[var(--color-text-muted)]">
					Kelola daftar posisi/struktural yang tersedia di Program Studi.
				</p>
			</div>
		</div>

		<!-- Data Table Component -->
		{#await data.positions}
			<TableSkeleton showTitle={true} title="Memuat Data Kerjasama..." columnsCount={4} />
		{:then rawList}
			<TableContent
				title="Daftar Semester"
				addButtonLabel="Add Semester"
				data={mapJabatanToTableContent(rawList)}
				onAdd={() => goto(mergeNewPath('add'))}
				onEdit={(data) => gotoEdit(data.id, page.url.pathname)}
				deleteAction="?/delete"
				onDeleteSuccess={(res) =>
					triggerMessage(
						res?.status ?? 'success',
						res?.title ?? 'Berhasil',
						res?.message ?? 'Data berhasil dihapus.'
					)}
				onDeleteError={(res) =>
					triggerMessage(
						res.status ?? 'error',
						res?.title ?? 'Gagal Menyimpan',
						res?.message ?? 'Terjadi kesalahan saat menghapus data.'
					)}
			/>
		{:catch error}
			<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
				Gagal memuat data kerjasama: {error.message}
			</div>
		{/await}
	</div>
</div>
