<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { folder_cloudinary_admin_article_profil, getUploadConfig, getUploadOptions, upload_cloudinary_preset } from '$lib/cloudinary/client';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import type { HistoryLeadersDTO } from '$lib/types/admin/article/profile.js';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';
	import type { TableContentType } from '$lib/types/tableContent.js';
	import { gotoEdit, mergeNewPath, parsePhotoToUrl } from '$lib/utils.js';
	import { UploadCloud, Plus, Edit, Trash2, Save, X, AlertTriangleIcon, UploadIcon } from 'lucide-svelte';
	import { CldUploadButton } from 'svelte-cloudinary';

	let { data } = $props();

	// State Form Kiri (Konten Sejarah)
	let contentId = $state(data.historyContent?.id ?? crypto.randomUUID());
	let title = $state(data.historyContent?.title ?? 'Sejarah');
	let description = $state(data.historyContent?.description ?? '');
	let imageUrl = $state(data.historyContent?.image_url ?? null);
	let selectedFile = $state<File | null>(null);
	let previewUrl = $state<string | null>(data.historyContent?.image_url ?? null);

	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imageUrl = result.info.secure_url;
previewUrl = result.info.secure_url;
		}
	}

		let isDeleteModalOpen = $state(false);
	let isSubmitting = $state(false);
	let selectedItem = $state<TableContentType | null>(null);

	let messageState = $state<{
		show: boolean;
		type: 'confirm' | 'success' | 'error';
		title: string;
		message: string;
	}>({
		show: false,
		type: 'confirm',
		title: '',
		message: ''
	});

	let showMessage = $state(false);

	// Derived Title untuk Modal Hapus dari Item Terpilih
	let itemTitle = $derived(
		(selectedItem?.items.find((i) => i.colomn === 'Nama Sekretaris')?.row as string) || ''
	);

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}


	// Triggered saat tombol hapus di tabel diklik
	function openDeleteModal(item: TableContentType) {
		selectedItem = item;
		messageState = {
			show: true,
			type: 'confirm',
			title: 'Konfirmasi Hapus',
			message: 'Apakah Anda yakin ingin menghapus data peta mata kuliah ini?'
		};
	}

	// Dipanggil saat client menekan tombol "OK" pada modal Message Konfirmasi
	function closeMessage() {
		messageState.show = false;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		selectedItem = null;
	}
export function mapHistoryLeadersToTableContent(items: HistoryLeadersDTO[]): TableContentType[] {
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
        // Ambil nama & foto dari hasil JOIN (flat/nested) dengan nilai aman (fallback)
        const headName = item.head_name ?? item.head?.name ?? '-';
        const headPhoto = parsePhotoToUrl(item.head_photo ?? item.head?.photo_url) || '';

        const secretaryName = item.secretary_name ?? item.secretary?.name ?? '-';
        const secretaryPhoto = parsePhotoToUrl(item.secretary_photo ?? item.secretary?.photo_url) || '';

        return {
            id: item.id,
            items: [
                {
                    colomn: 'Periode',
                    row: item.period || '-',
                    isHtml: false
                },
                {
                    colomn: 'Foto Ketua',
                    row: headPhoto,
                    isImage: true,
                    isHtml: false
                },
                {
                    colomn: 'Nama Ketua',
                    row: headName,
                    isHtml: false
                },
                {
                    colomn: 'Foto Sekretaris',
                    row: secretaryPhoto,
                    isImage: true,
                    isHtml: false
                },
                {
                    colomn: 'Nama Sekretaris',
                    row: secretaryName,
                    isHtml: false
                }
            ]
        };
    });
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

<div class="space-y-6 p-6 lg:p-10">
	<!-- HEADER TITLE -->
	<div class="border-scitech-slate/20 pb-4">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Sejarah</h1>
	</div>

	<!-- GRID 2 KOLOM (KIRI: KONTEN SEJARAH, KANAN: PIMPINAN JURUSAN) -->
	<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
		<!-- ================= bagian kiri: form ubah data sejarah ================= -->
		<div
			class="border-scitech-slate/20 bg-scitech-navy-glare space-y-6 rounded-2xl border p-6 shadow-xl lg:col-span-6"
		>
			<h2 class="text-scitech-mint text-sm font-semibold">Form Ubah Data Sejarah</h2>

			<form
				method="POST"
				action="?/saveContent"
				enctype="multipart/form-data"
				use:enhance
				class="space-y-6"
			>
				<input type="hidden" name="id" value={contentId} />
				<input type="hidden" name="existing_image_url" value={imageUrl ?? ''} />

				<!-- judul & foto row -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<label for="title" class="text-xs font-medium text-text-main">
							Judul Sejarah<span class="text-scitech-error">*</span>
						</label>
						<input
							id="title"
							name="title"
							type="text"
							bind:value={title}
							required
							class="border-scitech-slate/30 bg-scitech-navy focus:border-scitech-mint w-full rounded-xl border px-3 py-2 text-xs text-text-main focus:outline-none"
						/>
					</div>

					<div class="space-y-2">
						<label for="image" class="text-xs font-medium text-text-main">Foto</label>
						<div class="flex items-center gap-2">
								<CldUploadButton
						uploadPreset={upload_cloudinary_preset}
						options={getUploadOptions(folder_cloudinary_admin_article_profil)}
						config={getUploadConfig()}
						onSuccess={handleUploadSuccess}
						class="inline-flex items-center gap-2 rounded-xl bg-bg-primary-glare px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/10 hover:bg-bg-primary-glare/30"
					>
						<UploadIcon class="h-4 w-4" />
<span class={imageUrl ? 'text-emerald-400 font-semibold' : 'text-text-main'}>
    {imageUrl ? 'Foto Terunggah' : 'Unggah Gambar'}
</span>
					</CldUploadButton>						</div>
					</div>
				</div>

				{#if previewUrl}
					<div
						class="border-scitech-slate/30 bg-scitech-navy relative overflow-hidden rounded-xl border p-2"
					>
						<img
							src={previewUrl}
							alt="Foto Sejarah"
							class="max-h-48 w-full rounded-lg object-cover"
						/>
					</div>
				{/if}

				<!-- isi sejarah (form editor) -->
				<div class="space-y-2">
					<label for="description" class="text-xs font-medium text-text-main">
						Isi Sejarah<span class="text-scitech-error">*</span>
					</label>

					<FormEditor showSaveButton={false} bind:value={description} />
					<textarea name="description" class="hidden" bind:value={description}></textarea>
				</div>

				<button
					type="submit"
					class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95"
				>
					<Save class="h-4 w-4" />
					<span>Simpan Sejarah</span>
				</button>
			</form>
		</div>

		<!-- ================= bagian kanan: data sejarah pimpinan jurusan ================= -->

    <div class="lg:col-span-6">
		{#await data.historyLeaders}
			<TableSkeleton showTitle={true} title="Memuat Data Leader..." columnsCount={2} />
		{:then rawList}
			<TableContent
				title="Daftar Sejarah kepemimpinan"
				addButtonLabel="Sejarah"
				data={mapHistoryLeadersToTableContent(rawList)}
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
		{:catch error}
			<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
				Gagal memuat data kerjasama: {error.message}
			</div>
			[]
		{/await}
    </div>

	</div>
</div>

<!-- Modal Konfirmasi Hapus -->
<!-- {#if isDeleteModalOpen} -->
<!-- 	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"> -->
<!-- 		<div -->
<!-- 			class="bg-scitech-navy w-full max-w-md space-y-6 rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8" -->
<!-- 		> -->
<!-- 			<!-- Header Modal --> -->
<!-- 			<div class="flex items-center justify-between pb-4"> -->
<!-- 				<div class="flex items-center gap-2 font-bold text-red-400"> -->
<!-- 					<AlertTriangleIcon class="h-5 w-5" /> -->
<!-- 					<h3 class="text-sm">Konfirmasi Hapus Data</h3> -->
<!-- 				</div> -->
<!-- 				<button -->
<!-- 					type="button" -->
<!-- 					onclick={closeDeleteModal} -->
<!-- 					disabled={isSubmitting} -->
<!-- 					class="text-text-muted transition-colors hover:text-white" -->
<!-- 				> -->
<!-- 					<X class="h-5 w-5" /> -->
<!-- 				</button> -->
<!-- 			</div> -->
<!---->
<!-- 			<!-- Form Hapus Server Action --> -->
<!-- 			<form -->
<!-- 				method="POST" -->
<!-- 				action="?/delete" -->
<!-- 				use:enhance={() => { -->
<!-- 					isSubmitting = true; -->
<!-- 					return async ({ result }) => { -->
<!-- 						isSubmitting = false; -->
<!---->
<!-- 						if (result.type === 'success') { -->
<!-- 							closeDeleteModal(); -->
<!-- 							await invalidateAll(); -->
<!-- 							messageState = { -->
<!-- 								show: true, -->
<!-- 								type: 'success', -->
<!-- 								title: 'Berhasil', -->
<!-- 								message: (result.data?.message as string) || 'Data berhasil dihapus!' -->
<!-- 							}; -->
<!-- 						} else if (result.type === 'failure') { -->
<!-- 							closeDeleteModal(); -->
<!-- 							messageState = { -->
<!-- 								show: true, -->
<!-- 								type: 'error', -->
<!-- 								title: 'Gagal', -->
<!-- 								message: (result.data?.message as string) || 'Gagal menghapus data.' -->
<!-- 							}; -->
<!-- 						} else { -->
<!-- 							closeDeleteModal(); -->
<!-- 							messageState = { -->
<!-- 								show: true, -->
<!-- 								type: 'error', -->
<!-- 								title: 'Error', -->
<!-- 								message: 'Terjadi kesalahan sistem.' -->
<!-- 							}; -->
<!-- 						} -->
<!-- 					}; -->
<!-- 				}} -->
<!-- 				class="space-y-6" -->
<!-- 			> -->
<!-- 				<input type="hidden" name="id" value={selectedItem?.id ?? ''} /> -->
<!---->
<!-- 				<div class="space-y-2"> -->
<!-- 					<p class="text-xs leading-relaxed text-text-muted"> -->
<!-- 						Apakah Anda yakin ingin menghapus data -->
<!-- 						{#if itemTitle} -->
<!-- 							<span class="font-bold text-white">"{itemTitle}"</span> -->
<!-- 						{/if}? -->
<!-- 					</p> -->
<!-- 					<p class="text-[11px] text-red-400/80 italic"> -->
<!-- 						*Tindakan ini tidak dapat dibatalkan dan data akan dihapus permanen dari sistem. -->
<!-- 					</p> -->
<!-- 				</div> -->
<!---->
<!-- 				<!-- Form Action Buttons --> -->
<!-- 				<div class="flex justify-end gap-3 border-t border-white/10 pt-4"> -->
<!-- 					<button -->
<!-- 						type="button" -->
<!-- 						onclick={closeDeleteModal} -->
<!-- 						disabled={isSubmitting} -->
<!-- 						class="rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold text-text-muted transition-all hover:bg-white/10 disabled:opacity-50" -->
<!-- 					> -->
<!-- 						Batal -->
<!-- 					</button> -->
<!---->
<!-- 					<button -->
<!-- 						type="submit" -->
<!-- 						disabled={isSubmitting} -->
<!-- 						class="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/20 px-5 py-2 text-xs font-bold text-red-300 transition-all hover:bg-red-500/30 active:scale-95 disabled:opacity-50" -->
<!-- 					> -->
<!-- 						{#if isSubmitting} -->
<!-- 							<Loader2 class="h-4 w-4 animate-spin" /> -->
<!-- 							<span>Menghapus...</span> -->
<!-- 						{:else} -->
<!-- 							<Trash2 class="h-4 w-4" /> -->
<!-- 							<span>Hapus Data</span> -->
<!-- 						{/if} -->
<!-- 					</button> -->
<!-- 				</div> -->
<!-- 			</form> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- {/if} -->
<!---->

