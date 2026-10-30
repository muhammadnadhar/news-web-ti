<script lang="ts">
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import TableSkeleton from '$lib/components/loading/tableSkeleton.svelte';
	import { gotoEdit, mergeNewPath } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	//	import type { PedomanKkpDTO } from '$lib/dto/admin/article/akademik.js';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';
	import type { CurriculumDTO } from '$lib/dto/admin/article/kurikulum.js';
	import Message from '$lib/components/notif/message.svelte';

	let { data } = $props();

	let showMessage = $state(false);

	// Sync local state
	// let rawPedomanList = $derived<PedomanKkpDTO[]>(data.rawPedomanList || []);

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	/**
	 * Mapper untuk mengonversi data CurriculumDTO dari database
	 * ke format TableContentType yang dibutuhkan oleh komponen TableContent.
	 */
	export function mapCurriculumToTableContent(items: CurriculumDTO[]): TableContentType[] {
		return items.map((item: CurriculumDTO) => {
			// Format tanggal jika ada (opsional)
			const formattedDate = item.created_at
				? new Date(item.created_at).toLocaleDateString('id-ID', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
					})
				: '-';

			// Hitung jumlah gambar atau buat ringkasan teks gambar
			const totalImages = item.images && Array.isArray(item.images) ? item.images.length : 0;
			const imagesInfo = totalImages > 0 ? `${totalImages} Gambar dilampirkan` : 'Tidak ada gambar';

			return {
				id: item.id,
				items: [
					{
						colomn: 'Judul / Tipe',
						row: item.title || '-'
					},
					{
						colomn: 'Deskripsi',
						row: item.description || '-',
						isHtml: true // Mengizinkan komponen table merender tag HTML jika deskripsi berformat HTML
					},
					{
						colomn: 'Jumlah Gambar',
						row: imagesInfo
					},
					{
						colomn: 'Tanggal Dibuat',
						row: formattedDate
					}
				]
			};
		});
	}
</script>

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
	<div class="border-b border-white/10 pb-6">
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
			Daftar Kurikulums
		</h1>
		<p>Daftarkan kurikulum</p>
	</div>

	<!-- Component TableContent -->
	{#await data.curriculums}
		<TableSkeleton rowCount={3} columnsCount={4} />
	{:then rawList}
		<TableContent
			title="Data Kurikulums"
			addButtonLabel="Tambah Kurikulum Baru"
			data={mapCurriculumToTableContent(rawList)}
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
