<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import TableSkeleton from '$lib/components/loading/tableSkeleton.svelte';
	import Message, { type MessageStatus } from '$lib/components/notif/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import type { CourseMapDTO } from '$lib/dto/admin/article/kurikulum';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Sync local state
	// let courseMapList = $derived<TableContentType[]>(data.courseMapList || []);
	// let rawCourseMapList = $derived<CourseMapDTO[]>(data.rawCourseMapList || []);

	// State untuk Modal & Loading

	// State Komponen Message Popup


	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});
	let showMessage = $state(false);



	/* Mapper untuk mengonversi data CourseMapDTO dari database
	 * ke format TableContentType yang dibutuhkan oleh komponen TableContent.
	 */
	export function mapCourseMapToTableContent(items: CourseMapDTO[]): TableContentType[] {
		return items.map((item) => ({
			id: item.id,
			items: [
				{
					colomn: 'Gambar Pemetaan',
					row: item.image_url || '-',
					isImage: true
				},
				{
					colomn: 'Judul Matakuliah / Kurikulum',
					row: item.title
				}
			]
		}));
	}

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
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
			Peta Mata Kuliah
		</h1>
	</div>

	<!-- Component TableContent -->
	{#await data.rawCourseMapList}
		<TableSkeleton rowCount={3}  columnsCount={4} />
	{:then rawList}
		<TableContent
			title="Peta Mata kuliha"
			addButtonLabel="+ Peta Mata Kuliah"
			data={mapCourseMapToTableContent(rawList)}
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
					res?.status ?? 'error',
					res?.title ?? 'Gagal Menyimpan',
					res?.message ?? 'Terjadi kesalahan saat menghapus data.'
				)}
		/>
		<!-- deleteAction={"/delete"} <- gak pakek karena default nya -->
	{:catch error}
		<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
			Gagal memuat data kerjasama: {error.message}
		</div>
	{/await}
</div>
