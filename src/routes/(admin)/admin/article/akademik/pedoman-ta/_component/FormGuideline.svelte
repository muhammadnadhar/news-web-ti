<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import Message from '$lib/components/admin/message.svelte';
	import { removeLastPath } from '$lib/utils';
	import type { ResponseMessage } from '$lib/types/message';
	import {
		ArrowLeft,
		BookOpen,
		FileText,
		Image as ImageIcon,
		Trash2,
		Save,
		Loader2Icon,
		Upload
	} from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import {
		folder_cloudinary_admin_article_akademik,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';

	interface GuidelineData {
		id?: string;
		title?: string;
		image_url?: string | null;
		description?: string | null;
	}

	let {
		form,
		initialData = null,
		isEdit = false
	}: {
		form: any;
		initialData?: GuidelineData | null;
		isEdit?: boolean;
	} = $props();

	let isSubmitting = $state(false);
	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	// State lokal untuk gambar dan deskripsi editor
	let imageUrl = $state(form?.values?.image_url ?? initialData?.image_url ?? '');
	let description = $state(form?.values?.description ?? initialData?.description ?? '');


	// Hapus foto jika ingin mengganti
	function removeImage() {
		imageUrl = '';
	}
function handleUploadSuccess(result: any) {
    if (result?.info?.secure_url) {
        imageUrl = result.info.secure_url;
        // Pulihkan scroll body yang terkunci oleh Cloudinary
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'auto';
        }
    }
}

function handleUpload(result: any) {
    if (result?.event === 'success') {
        imageUrl = result.info.secure_url;
        // Pulihkan scroll body yang terkunci oleh Cloudinary
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'auto';
        }
    }
}


	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<!-- Header Navigation -->
	<div class="flex items-center justify-between border-b border-white/10 pb-4">
		<div class="flex items-center gap-3">
			<!-- <button -->
			<!-- 	type="button" -->
			<!-- 	onclick={() => goto(removeLastPath())} -->
			<!-- 	class="rounded-xl border border-white/10 p-2.5 text-text-muted transition-all hover:border-white/20 hover:bg-white/10 hover:text-text-main active:scale-95" -->
			<!-- 	title="Kembali" -->
			<!-- > -->
			<!-- 	<ArrowLeft class="h-5 w-5" /> -->
			<!-- </button> -->
			<div>
				<div class="flex items-center gap-2">
					<BookOpen class="text-scitech-mint h-5 w-5" />
					<h1 class="text-scitech-mint text-lg font-bold tracking-wide sm:text-xl">
						{isEdit ? 'Edit Pedoman TA' : 'Tambah Pedoman TA'}
					</h1>
				</div>
				<p class="text-xs text-text-muted">
					{isEdit
						? 'Perbarui data pedoman penulisan Tugas Akhir.'
						: 'Isi judul, foto sampul, dan ringkasan pedoman penulisan Tugas Akhir baru.'}
				</p>
			</div>
		</div>
	</div>

	<!-- Alert / Toast Notification -->
	{#if showMessage || form?.message}
		<Message
			status={showMessage ? messageConfig.status : 'error'}
			title={showMessage ? messageConfig.title : 'Gagal'}
			message={showMessage ? messageConfig.message : form?.message || ''}
			dismissible={true}
			timeout={4000}
			onclose={() => (showMessage = false)}
		/>
	{/if}

	<!-- Glassmorphism Form Card -->
	<div
		class="bg-scitech-slate/50 rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'success',
							title: 'Berhasil',
							message: isEdit ? 'Pedoman TA berhasil diperbarui.' : 'Pedoman TA berhasil disimpan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						if (!isEdit) {
							imageUrl = '';
							description = '';
						}
						await update({ reset: !isEdit });
					} else if (result.type === 'failure') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'error',
							title: 'Gagal',
							message: (result.data?.message as string) || 'Gagal menyimpan pedoman.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						await update();
					} else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan sistem yang tidak diketahui.');
						await update();
					}
				};
			}}
			class="space-y-6"
		>
			<!-- Field 1: Judul Pedoman TA (Required) -->
			<div class="space-y-2">
				<label for="title" class="flex items-center gap-2 text-xs font-semibold text-text-main">
					<FileText class="text-scitech-cyan h-4 w-4" />
					<span>Judul Pedoman TA</span>
					<span class="text-red-400">*</span>
				</label>

				<input
					type="text"
					id="title"
					name="title"
					value={form?.values?.title ?? initialData?.title ?? ''}
					placeholder="Contoh: Pedoman Penulisan Tugas Akhir 2026"
					required
					disabled={isSubmitting}
					class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-white/10 px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:ring-2 focus:outline-none disabled:opacity-50"
				/>
			</div>

			<!-- Field 2: Cloudinary Image Upload (Optional) -->
			<div class="space-y-2">
				<label for="image_url" class="flex items-center gap-2 text-xs font-semibold text-text-main">
					<ImageIcon class="text-scitech-cyan h-4 w-4" />
					<span>Foto Sampul Pedoman</span>
				</label>

				<input type="hidden" name="image_url" value={imageUrl} />

				{#if imageUrl}
					<div
						class="bg-scitech-navy relative overflow-hidden rounded-xl border border-white/10 p-3"
					>
						<div class="flex items-center gap-4">
							<img
								src={imageUrl}
								alt="Preview Sampul"
								class="h-28 w-20 rounded-lg border border-white/10 object-cover shadow-md"
							/>
							<div class="space-y-2">
								<p class="text-xs font-semibold text-text-main">Foto Sampul Terunggah</p>
								<p class="max-w-xs text-[11px] break-all text-text-muted">{imageUrl}</p>
								<button
									type="button"
									onclick={removeImage}
									disabled={isSubmitting}
									class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 active:scale-95 disabled:opacity-50"
								>
									<Trash2 class="h-3.5 w-3.5" />
									<span>Hapus Foto</span>
								</button>
							</div>
						</div>
					</div>
				{:else}
					<CldUploadWidget
						config={getUploadConfig()}
						uploadPreset={upload_cloudinary_preset}
						options={getUploadOptions(folder_cloudinary_admin_article_akademik)}
						onUpload={handleUpload}
						let:open
						let:isLoading
						onSuccess={handleUploadSuccess}
					>
						<button
							type="button"
							onclick={() => open()}
							disabled={isSubmitting}
							class="bg-scitech-navy/50 hover:border-scitech-mint/50 hover:bg-scitech-navy flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 p-6 text-text-muted transition-all hover:text-text-main active:scale-98 disabled:opacity-50"
						>
							<div class="text-scitech-cyan rounded-full border border-white/10 bg-white/5 p-3">
								<Upload class="h-5 w-5" />
							</div>
							<span class="text-xs font-semibold">Klik untuk Unggah Foto Sampul (Cloudinary)</span>
							<span class="text-[10px] text-text-muted">Format JPG, PNG, atau WEBP</span>
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<!-- Field 3: Deskripsi / Ringkasan Pedoman (FormEditor) -->
			<div class="space-y-2">
				<label
					for="description"
					class="flex items-center gap-2 text-xs font-semibold text-text-main"
				>
					<BookOpen class="text-scitech-cyan h-4 w-4" />
					<span>Deskripsi / Ringkasan Pedoman</span>
				</label>

				<input type="hidden" name="description" value={description} />

				<div class="bg-scitech-navy overflow-hidden rounded-xl border border-white/10">
					<FormEditor
						title="Editor Deskripsi Pedoman TA"
						label="Deskripsi / Ringkasan Pedoman"
						bind:value={description}
						showSaveButton={false}
					/>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
				<button
					type="button"
					onclick={() => goto(removeLastPath())}
					disabled={isSubmitting}
					class="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-white/10 hover:text-text-main active:scale-95 disabled:opacity-50"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="bg-scitech-mint text-scitech-navy shadow-scitech-mint/10 hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2Icon class="h-4 w-4 animate-spin" />
						<span>{isEdit ? 'Memperbarui...' : 'Menyimpan...'}</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>{isEdit ? 'Update Pedoman' : 'Simpan Pedoman'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
