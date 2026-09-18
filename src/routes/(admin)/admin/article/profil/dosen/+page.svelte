<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Message from '$lib/components/admin/message.svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import type { LecturerStaffItemDTO } from '$lib/types/admin/article/profile.js';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';
	import type { TableContentType } from '$lib/types/tableContent.js';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { Plus, Edit, Trash2 } from 'lucide-svelte';

	let { data } = $props();

	/**
	 * Mapper untuk mengonversi data LecturerStaffItemDTO dari database
	 * ke format TableContentType yang dibutuhkan oleh komponen TableContent.
	 */
	export function mapLecturerStaffToTableContent(
		items: LecturerStaffItemDTO[]
	): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Foto',
					row: item.photo_url || '-',
					isImage: true
				},
				{
					colomn: 'Nama Lengkap',
					row: item.name
				},
				{
					colomn: 'NIDN',
					row: item.nidn || '-'
				},
				{
					colomn: 'Peran',
					row: item.is_primary ? `${item.role} Utama` : item.role
				},
				{
					colomn: 'Keahlian / Tugas',
					row: item.expertise
				},
				{
					colomn: 'PDDikti',
					row: item.pddikti_url || '-',
					isLink: Boolean(item.pddikti_url)
				}
			]
		}));
	}

	// State untuk Search dan Pagination
	let searchQuery = $state('');
	let entriesPerPage = $state(10);
	let currentPage = $state(1);

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

	// Filter data berdasarkan query pencarian
	let filteredData = $derived(
		(data.lecturerStaffList || []).filter((item) => {
			const query = searchQuery.toLowerCase();
			return (
				item.name.toLowerCase().includes(query) ||
				(item.nidn && item.nidn.toLowerCase().includes(query)) ||
				item.expertise.toLowerCase().includes(query)
			);
		})
	);

	const addUrl = $derived.by(() => {
		const currentPath = page.url.pathname;
		// Jika sudah di halaman /add, tetap di halaman itu. Jika belum, tambahkan /add
		return currentPath.endsWith('/add') ? currentPath : `${currentPath}/add`;
	});

	// Pagination Math
	let totalEntries = $derived(filteredData.length);
	let totalPages = $derived(Math.ceil(totalEntries / entriesPerPage) || 1);
	let startIndex = $derived((currentPage - 1) * entriesPerPage);
	let paginatedData = $derived(filteredData.slice(startIndex, startIndex + entriesPerPage));
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

<div class="space-y-6 p-6 lg:p-10">
	<!-- header bar -->
	<div class="border-scitech-slate/20 border-b pb-4">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Dosen & Staff</h1>
	</div>

	<div
		class="border-scitech-slate/20 bg-scitech-navy-glare space-y-4 rounded-2xl border p-6 shadow-xl"
	>
		{#await data.lecturerStaffList}
			<TableSkeleton showTitle={true} title="Memuat Data Kerjasama..." columnsCount={6} />
		{:then rawList}
			<TableContent
				title="Daftar Dosen dan Staff"
				addButtonLabel="Add Dosen atau Staff"
				data={mapLecturerStaffToTableContent(rawList)}
				onAdd={() => goto(mergeNewPath('add'))}
				onEdit={(data) => gotoEdit(data.id, page.url.pathname)}
				onDeleteSuccess={(res) =>
					triggerMessage(
						res?.status ?? 'success',
						res?.title ?? 'Berhasil',
						res?.message ?? 'Data berhasil dihapus.'
					)}
				onDeleteError={(res) =>
					triggerMessage(
						res?.status ?? 'error',
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
