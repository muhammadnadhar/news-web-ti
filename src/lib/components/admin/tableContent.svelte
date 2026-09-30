<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { ResponseMessage } from '$lib/types/message';
	//
	// semua desian Halaman yang mengguakanTable akan memanggil Compoennt ini
	//

	import type { TableContentType, tableItem } from '$lib/types/tableContent';
	import {
		ArrowUpDown,
		Edit3,
		Trash2,
		AlertTriangle,
		X,
		Search,
		Plus,
		Loader2Icon
	} from 'lucide-svelte';

	let {
		title = '',
		addButtonLabel = '',
		data = [],
		onAdd,
		onEdit,

		// delete section url dan callbak function
		deleteAction = '?/delete',
		onDeleteSuccess,
		onDeleteError
	}: {
		title?: string;
		addButtonLabel?: string;
		data: TableContentType[];
		// optional
		onAdd?: () => void;
		onEdit?: (item: TableContentType) => void;
		deleteAction?: string; // Action URL, default: '?/delete'
		onDeleteSuccess?: (data: ResponseMessage) => void;
		onDeleteError?: (data: ResponseMessage) => void;
	} = $props();

	// State internal
	let searchQuery = $state('');
	let entriesPerPage = $state(10);
	let currentPage = $state(1);
	let itemToDelete = $state<TableContentType | null>(null);
	let isSubmitting = $state(false);

	// Ambil daftar kolom secara otomatis dari baris data pertama
	let columns = $derived.by(() => {
		if (data.length === 0) return [];
		return data[0].items.map((it) => it.colomn);
	});

	// Filter pencarian
	let filteredData = $derived.by(() => {
		if (!searchQuery.trim()) return data;
		const query = searchQuery.toLowerCase();
		return data.filter((row) =>
			row.items.some((it) => String(it.row).toLowerCase().includes(query))
		);
	});

	// Paginasi Data
	let totalEntries = $derived(filteredData.length);
	let totalPages = $derived(Math.ceil(totalEntries / entriesPerPage) || 1);
	let startIndex = $derived((currentPage - 1) * entriesPerPage);
	let endIndex = $derived(Math.min(startIndex + entriesPerPage, totalEntries));

	let paginatedData = $derived.by(() => {
		return filteredData.slice(startIndex, startIndex + entriesPerPage);
	});

	function closeDeleteModal() {
		if (isSubmitting) return; // Mencegah modal ditutup saat proses hapus berjalan
		itemToDelete = null;
		isSubmitting = false;
	}

	// Otomatis mengekstrak nama/judul item dari array kolom untuk ditampilkan pada pesan konfirmasi
	let itemTitle = $derived.by(() => {
		if (!itemToDelete?.items) return '';
		const nameCol = itemToDelete.items.find((col: any) =>
			col.colomn.toLowerCase().includes('nama')
		);
		return nameCol ? nameCol.row : itemToDelete.items[0]?.row || '';
	});

	// Helper deteksi URL Gambar
	function checkIsImage(item: tableItem): boolean {
		if (item.isImage) return true;
		if (typeof item.row !== 'string') return false;

		// Hapus query parameters (?v=123, ?token=xyz) dan hash (#)
		const cleanUrl = item.row.split('?')[0].split('#')[0];

		return (
			cleanUrl.match(/\.(jpeg|jpg|gif|png|webp|svg|avif)$/i) !== null ||
			item.row.startsWith('data:image/')
		);
	}

	// Helper deteksi HTML
	function checkIsHtml(item: tableItem): boolean {
		return Boolean(item.isHtml);
	}

	// Helper deteksi Tautan Link
	function checkIsLink(item: tableItem): boolean {
		if (item.isLink) return true;
		if (typeof item.row !== 'string') return false;
		return item.row.startsWith('http://') || item.row.startsWith('https://');
	}

	// Reset ke halaman pertama saat melakukan pencarian
	$effect(() => {
		searchQuery; // dependency
		currentPage = 1;
	});
</script>

<div
	class="bg-scitech-slate/50 space-y-4 rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur-xl"
>
	<!-- header action & title bar -->
	{#if title || addButtonLabel}
		<div
			class="flex flex-col gap-3 border-b border-black pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10"
		>
			{#if title}
				<h2 class="text-scitech-mint text-sm font-bold tracking-wide">{title}</h2>
			{/if}

			{#if addButtonLabel && onAdd}
				<button
					type="button"
					onclick={onAdd}
					class="bg-scitech-mint text-scitech-navy shadow-scitech-mint/10 hover:bg-scitech-mint-hover inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md transition-all active:scale-95 sm:w-auto"
				>
					<Plus class="h-4 w-4" />
					<span>{addButtonLabel}</span>
				</button>
			{/if}
		</div>
	{/if}

	<div
		class="flex flex-col gap-3 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between"
	>
		<div class="flex items-center gap-2">
			<span>Show</span>
			<select
				bind:value={entriesPerPage}
				class="focus:border-scitech-mint rounded-lg border border-white/10 bg-bg-secondary px-2.5 py-1.5 text-text-main focus:outline-none"
			>
				<option value={5}>5</option>
				<option value={10}>10</option>
				<option value={25}>25</option>
				<option value={50}>50</option>
			</select>
			<span>entries</span>
		</div>

		<div class="relative w-full sm:w-64">
			<Search class="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search..."
				class="w-full rounded-lg border border-black/10 bg-bg-secondary py-1.5 pr-3 pl-9 text-xs text-text-main placeholder-text-muted transition-all focus:border-e-border-light focus:outline-none dark:border-white/10"
			/>
		</div>
	</div>

	<div
		class="bg-scitech-navy/60 overflow-x-auto rounded-xl border border-black/10 dark:border-white/10"
	>
		<table class="w-full border-collapse text-left text-xs">
			<!-- Table Header -->
			<thead>
				<tr
					class="border-b border-white/10 bg-bg-primary/5 font-mono text-[11px] tracking-wider text-text-muted uppercase"
				>
					{#each columns as col}
						<th class="p-3.5">
							<div class="flex items-center gap-1.5">
								<span>{col}</span>
								<ArrowUpDown class="text-scitech-cyan/70 h-3 w-3" />
							</div>
						</th>
					{/each}
					<th class="w-28 p-3.5 text-center">Menu</th>
				</tr>
			</thead>

			<!-- Table Body -->
			<tbody class="divide-y divide-white/5 text-text-muted">
				{#if paginatedData.length === 0}
					<tr>
						<td colspan={columns.length + 1} class="p-8 text-center font-mono text-text-muted">
							Data tidak ditemukan.
						</td>
					</tr>
				{:else}
					{#each paginatedData as rowData, i (rowData.id ?? i)}
						<tr class="group transition-colors hover:bg-bg-secondary-hover">
							{#each rowData.items as item}
								<td class="p-3.5 align-middle">
									{#if checkIsImage(item)}
										<!-- Tampilan Gambar/Foto -->
										<div
											class="h-16 w-24 overflow-hidden rounded-lg border border-black bg-black/40 dark:border-white/10"
										>
											<img
												src={String(item.row)}
												alt={item.colomn}
												class="h-full w-full object-cover transition-transform group-hover:scale-105"
											/>
											<!-- <CldImage -->
											<!--    src="cld-sample-5" -->
											<!--    width="300" -->
											<!--    height="300" -->
											<!--    crop="fill" -->
											<!--    gravity="faces" -->
											<!--    tint="equalize:80:blue" -->
											<!--    alt="Gambar dengan efek potong wajah dan warna biru" -->
											<!--  /> -->
										</div>
									{:else if checkIsLink(item)}
										<!-- Tampilan Tautan/Link -->
										<a
											href={String(item.row)}
											target="_blank"
											rel="noopener noreferrer"
											class="text-scitech-cyan break-all hover:underline"
										>
											{item.row}
										</a>
									{:else if checkIsHtml(item)}
										<div class="group-hover:text-scitech-mint text-text-main transition-colors">
											{@html item.row}
										</div>
									{:else}
										<!-- Tampilan Teks Biasa -->
										<span class="group-hover:text-scitech-mint text-text-main transition-colors">
											{item.row}
										</span>
									{/if}
								</td>
							{/each}

							<!-- Menu Action (Edit & Delete) -->
							<td class="p-3.5 align-middle">
								<div class="flex items-center justify-center gap-2">
									{#if onEdit}
										<button
											type="button"
											title="Edit"
											onclick={() => onEdit(rowData)}
											class="border-scitech-cyan/30 bg-scitech-cyan/10 text-scitech-cyan hover:bg-scitech-cyan/20 rounded-lg border p-2 transition-all active:scale-95"
										>
											<Edit3 class="h-3.5 w-3.5" />
										</button>
									{/if}
									{#if deleteAction}
										<button
											type="button"
											title="Hapus"
											onclick={() => (itemToDelete = rowData)}
											class="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
										>
											<Trash2 class="h-3.5 w-3.5" />
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>

			<tfoot>
				<tr class="border-t border-white/10 bg-white/5 font-mono text-[11px] text-text-muted">
					{#each columns as col}
						<th class="p-3">{col}</th>
					{/each}
					<th class="p-3 text-center">Menu</th>
				</tr>
			</tfoot>
		</table>
	</div>

	<div
		class="flex flex-col gap-3 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			Showing {totalEntries === 0 ? 0 : startIndex + 1} to {endIndex} of {totalEntries} entries
		</div>

		<!-- Pagination Buttons -->
		<div class="flex items-center gap-1">
			<button
				type="button"
				disabled={currentPage === 1}
				onclick={() => currentPage--}
				class="rounded-lg border border-white/10 px-3 py-1.5 transition-all hover:bg-white/5 disabled:opacity-30"
			>
				Previous
			</button>

			{#each Array(totalPages) as _, i}
				<button
					type="button"
					onclick={() => (currentPage = i + 1)}
					class="rounded-lg px-3 py-1.5 font-bold transition-all {currentPage === i + 1
						? 'bg-scitech-mint text-scitech-navy'
						: 'border border-white/10 text-text-main hover:bg-white/5'}"
				>
					{i + 1}
				</button>
			{/each}

			<button
				type="button"
				disabled={currentPage === totalPages || totalPages === 0}
				onclick={() => currentPage++}
				class="rounded-lg border border-white/10 px-3 py-1.5 transition-all hover:bg-white/5 disabled:opacity-30"
			>
				Next
			</button>
		</div>
	</div>
</div>

<!-- --------------------------------MODAL----------------------  -->

<!-- Modal Alert Konfirmasi Hapus -->
{#if itemToDelete}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-opacity"
	>
		<div
			class="relative w-full max-w-md overflow-hidden rounded-3xl border border-border-light bg-bg-secondary p-6 text-text-main shadow-2xl transition-all sm:p-7"
		>
			<!-- Background Glow Accent (Red Warning Glow) -->
			<div
				class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-status-error/10 blur-2xl"
			></div>

			<!-- Header Modal & Icon Badge -->
			<div class="flex items-start justify-between gap-4">
				<div class="flex items-center gap-3.5">
					<div
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-status-error/20 bg-status-error/10 text-status-error shadow-sm"
					>
						<AlertTriangle class="h-5 w-5" />
					</div>
					<div>
						<h3 class="text-base font-bold text-text-main sm:text-lg">Konfirmasi Hapus</h3>
						<p class="text-xs text-text-muted">Tindakan ini memerlukan verifikasi Anda</p>
					</div>
				</div>

				<button
					type="button"
					onclick={closeDeleteModal}
					disabled={isSubmitting}
					class="flex h-8 w-8 items-center justify-center rounded-full border border-border-color bg-bg-primary text-text-muted transition-colors hover:bg-bg-secondary-hover hover:text-text-main disabled:opacity-50"
					aria-label="Tutup modal"
				>
					<X class="h-4 w-4" />
				</button>
			</div>

			<!-- Form Hapus Server Action -->
			<form
				method="POST"
				action={deleteAction}
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result }) => {
						if (result.type === 'success') {
							// 1. Tunggu hingga SvelteKit selesai memuat ulang data tabel terbaru
							await invalidateAll();

							onDeleteSuccess?.(
								(result.data as ResponseMessage) ?? {
									status: 'success',
									title: 'Berhasil',
									message: 'Data berhasil dihapus.'
								}
							);

							//  Tutup modal SETELAH data tabel ter-update
							isSubmitting = false;
							closeDeleteModal();
						} else if (result.type === 'failure') {
							isSubmitting = false;
							closeDeleteModal();
							onDeleteError?.(
								(result.data as ResponseMessage) ?? {
									status: 'error',
									title: 'Gagal',
									message: 'Gagal menghapus data.'
								}
							);
						} else {
							isSubmitting = false;
							closeDeleteModal();
							onDeleteError?.({
								status: 'error',
								title: 'Kesalahan Sistem',
								message: 'Terjadi kesalahan sistem saat menghapus data.'
							});
						}
					};
				}}
				class="mt-5 space-y-5"
			>
				<input type="hidden" name="id" value={itemToDelete.id} />

				<!-- Detail Data yang Dihapus -->
				<div class="space-y-3">
					<p class="text-xs leading-relaxed text-text-muted sm:text-sm">
						Apakah Anda yakin ingin menghapus data berikut?
					</p>

					{#if itemTitle}
						<div class="rounded-2xl border border-border-color bg-bg-primary p-3.5">
							<span class="block text-[10px] font-semibold tracking-wider text-text-muted uppercase"
								>Target Data</span
							>
							<span class="text-sm font-semibold break-all text-text-main">{itemTitle}</span>
						</div>
					{/if}

					<!-- Peringatan Akses/Dampak -->
					<div
						class="flex items-start gap-2.5 rounded-xl border border-status-error/20 bg-status-error/10 p-3 text-xs leading-relaxed text-status-error"
					>
						<AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
						<span>Tindakan ini permanen. Data yang dihapus tidak dapat dipulihkan kembali.</span>
					</div>
				</div>

				<!-- Form Action Buttons -->
				<div class="flex items-center justify-end gap-3 border-t border-border-color pt-4">
					<button
						type="button"
						onclick={closeDeleteModal}
						disabled={isSubmitting}
						class="rounded-xl border border-border-color bg-bg-primary px-4 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-bg-secondary-hover hover:text-text-main active:scale-95 disabled:opacity-50"
					>
						Batal
					</button>

					<button
						type="submit"
						disabled={isSubmitting}
						class="inline-flex items-center gap-2 rounded-xl bg-status-error px-5 py-2.5 text-xs font-bold text-text-main shadow-lg shadow-status-error/20 transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isSubmitting}
							<Loader2Icon class="h-4 w-4 animate-spin" />
							<span>Menghapus data...</span>
						{:else}
							<Trash2 class="h-4 w-4" />
							<span>Hapus Data</span>
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- contoh penggunaan  / ubah dahulu ke TbaleContentType-->
<!---->
<!-- <script lang="ts"> -->
<!-- 	import DataTable from '$lib/components/DataTable.svelte'; -->
<!-- 	import type { TableContentType } from '$lib/types/table'; -->
<!---->
<!-- 	let dataPeriode: TableContentType[] = [ -->
<!-- 		{ id: 1, items: [{ colomn: 'Periode', row: 'Periode 2018 - 2021' }] }, -->
<!-- 		{ id: 2, items: [{ colomn: 'Periode', row: 'Periode 2020 - 2022' }] }, -->
<!-- 		{ id: 3, items: [{ colomn: 'Periode', row: 'Periode 2022 - 2024' }] } -->
<!-- 	]; -->
<!-- </script> -->
<!---->
<!-- <DataTable -->
<!-- 	title="Data Sejarah Pimpinan Jurusan" -->
<!-- 	addButtonLabel="+ Periode" -->
<!-- 	data={dataPeriode} -->
<!-- 	onAdd={() => alert('Tambah Periode')} -->
<!-- 	onEdit={(item) => console.log('Edit', item)} -->
<!-- 	onDelete={(item) => console.log('Delete', item)} -->
<!-- /> -->
