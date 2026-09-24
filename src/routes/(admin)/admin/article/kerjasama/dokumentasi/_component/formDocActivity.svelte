<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import { ImageIcon, Save, Plus } from 'lucide-svelte';
	import {
		folder_cloudinary_admin_article_kerjasama,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';
	import type { ActivityDocumentationDTO } from '$lib/dto/admin/article/kerjasama';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import type { ResponseMessage } from '$lib/types/message';

	interface Props {
		initialData?: Partial<ActivityDocumentationDTO> | null;
		formError?: string | null;
		isEditMode?: boolean;
		submitLabel?: string;
		onCancel?: () => void;
	}

	let {
		initialData = null,
		formError = null,
		isEditMode = false,
		submitLabel,
		onCancel
	}: Props = $props();

	// State lokal

	let description = $state(initialData?.description ?? '');
	let imageUrl = $state(initialData?.image_url || '');
	let isSubmitting = $state(false);
	let showMessage = $state(false);

	let formElement = $state<HTMLFormElement | null>(null);

	function handleParentSubmit(editorData: string) {
		description = editorData; // Sinkronisasi ulang (opsional karena sudah bind:value)

		// Trigger pengiriman form parent ke SvelteKit Form Action
		if (formElement) {
			formElement.requestSubmit();
		}
	}

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	// Format tanggal untuk input type="date" (YYYY-MM-DD)
	function formatDateForInput(dateStr?: string | null): string {
		if (!dateStr) return '';
		return dateStr.split('T')[0];
	}

	// Handler upload Cloudinary
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imageUrl = result.info.secure_url;
		}
	}

	$effect(() => {
		if (initialData) {
			description = initialData.description || '';
			imageUrl = initialData.image_url || '';
		}
	});

	// Hapus foto
	function removeImage() {
		imageUrl = '';
	}
</script>

<div class="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
	<!-- Header -->
	<header class="mb-6 space-y-1">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">
			{isEditMode ? 'Edit Dokumentasi Kegiatan' : 'Tambah Dokumentasi Kegiatan Baru'}
		</h1>
		<p class="text-sm text-text-muted">
			Kelola foto, tautan drive, dan informasi kegiatan dokumentasi secara rinci.
		</p>
	</header>

	<!-- Feedback Messages -->
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

	{#if formError}
		<div class="mb-6">
			<Message status="error" title="Gagal" message={formError} dismissible={true} />
		</div>
	{/if}

	<!-- Container Card -->
	<div class="rounded-xl border border-border-light bg-bg-secondary shadow-sm">
		<form
			method="POST"
			bind:this={formElement}
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					// 1. Jika form berhasil dieksekusi oleh SvelteKit
					if (result.type === 'success') {
						triggerMessage(
							'success',
							(result.data?.title as string) || 'Berhasil',
							(result.data?.message as string) || 'Data berhasil disimpan.'
						);

						if (!isEditMode) {
							imageUrl = '';
							await update({ reset: true });
						} else {
							await update({ reset: false });
						}
					}
					// Jika server melakukan redirect setelah sukses
					else if (result.type === 'redirect') {
						await update();
					}
					//Jika validation/action failure dari fail() SvelteKit
					else if (result.type === 'failure' && result.data) {
						triggerMessage(
							'error',
							(result.data.title as string) || 'Gagal Menyimpan',
							(result.data.message as string) || 'Terjadi kesalahan pada input data.'
						);
						await update();
					}
					// 4. Jika ada unhandled error dari server (500)
					else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan sistem saat memproses data.');
						await update();
					}
				};
			}}
			class="space-y-6 p-6 sm:p-8"
		>
			<!-- Field: Judul Kegiatan -->
			<div class="space-y-2">
				<label for="title" class="block text-sm font-medium text-text-main">
					Judul Kegiatan / Nama Dokumentasi <span class="text-status-error">*</span>
				</label>
				<input
					type="text"
					id="title"
					name="title"
					defaultValue={initialData?.title || ''}
					placeholder="Contoh: Workshop Pemrograman SvelteKit 2026"
					required
					class="w-full rounded-lg border border-border-light bg-bg-primary px-4 py-2.5 text-sm text-text-main transition duration-150 placeholder:text-text-muted focus:border-accent-purple focus:outline-none"
				/>
			</div>

			<!-- Field: Tanggal Pelaksanaan -->
			<div class="space-y-2">
				<label for="event_date" class="block text-sm font-medium text-text-main">
					Tanggal Pelaksanaan Kegiatan
				</label>
				<input
					type="date"
					id="event_date"
					name="event_date"
					defaultValue={formatDateForInput(initialData?.event_date)}
					class="w-full rounded-lg border border-border-light bg-bg-primary px-4 py-2.5 text-sm text-text-main transition duration-150 focus:border-accent-purple focus:outline-none"
				/>
			</div>

			<!-- field: link google drive (baru) -->
			<div class="space-y-2">
				<label for="link_drive" class="block text-sm font-medium text-text-main">
					Tautan Google Drive / Folder Dokumentasi
				</label>
				<input
					type="url"
					id="link_drive"
					name="link_drive"
					defaultValue={initialData?.link_drive || ''}
					placeholder="https://drive.google.com/drive/folders/..."
					class="w-full rounded-lg border border-border-light bg-bg-primary px-4 py-2.5 text-sm text-text-main transition duration-150 placeholder:text-text-muted focus:border-accent-purple focus:outline-none"
				/>
			</div>

			<!-- Field: Upload Foto Media Dokumentasi Cloudinary -->
			<div class="space-y-2">
				<label for="image_upload" class="block text-sm font-medium text-text-main">
					Foto / Media Utama Dokumentasi <span class="text-status-error">*</span>
				</label>
				<input type="hidden" name="image_url" value={imageUrl} required />

				{#if imageUrl}
					<div
						class="relative w-full max-w-md overflow-hidden rounded-xl border border-border-light bg-bg-primary p-2"
					>
						<img
							src={imageUrl}
							alt="Preview Dokumentasi"
							class="h-52 w-full rounded-lg object-cover"
						/>
						<button
							type="button"
							onclick={removeImage}
							class="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-status-error/30 bg-status-error/10 px-3 py-2 text-xs font-semibold text-status-error transition hover:bg-status-error/20"
						>
							✕ Hapus & Ganti Gambar
						</button>
					</div>
				{:else}
					<CldUploadWidget
						config={getUploadConfig()}
						uploadPreset={upload_cloudinary_preset}
						options={getUploadOptions(folder_cloudinary_admin_article_kerjasama)}
						onSuccess={handleUploadSuccess}
						let:open
					>
						<button
							type="button"
							onclick={() => open()}
							class="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-light bg-bg-primary px-6 py-8 text-center transition hover:bg-bg-primary-glare"
						>
							<div
								class="mb-2 rounded-full border border-border-light bg-bg-secondary p-3 text-accent-purple"
							>
								<ImageIcon class="h-6 w-6" />
							</div>
							<span class="text-sm font-semibold text-accent-purple">
								Unggah Foto Dokumentasi
							</span>
							<span class="mt-1 text-xs text-text-muted"> Format gambar </span>
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<!-- Field: Deskripsi Singkat Kegiatan -->
			<div class="space-y-2">
				<input type="hidden" value={description} name="description" />

				<FormEditor
					onSave={handleParentSubmit}
					bind:value={description}
					label={'Isi Deskripsi Kegiatan'}
					showSaveButton={false}
				/>

				<!-- <textarea -->
				<!-- 	id="description" -->
				<!-- 	name="description" -->
				<!-- 	rows="4" -->
				<!-- 	placeholder="Tuliskan deskripsi ringkas mengenai pelaksanaan kegiatan ini..." -->
				<!-- 	defaultValue={initialData?.description || ''} -->
				<!-- 	class="w-full rounded-lg border border-border-light bg-bg-primary px-4 py-2.5 text-sm text-text-main transition duration-150 placeholder:text-text-muted focus:border-accent-purple focus:outline-none" -->
				<!-- ></textarea> -->
			</div>

			<!-- Form Actions -->
			<div class="flex items-center justify-end gap-3 border-t border-border-light pt-6">
				<button
					type="button"
					onclick={onCancel ?? (() => history.back())}
					disabled={isSubmitting}
					class="rounded-lg border border-border-light bg-bg-primary px-5 py-2.5 text-sm font-medium text-text-main transition hover:bg-bg-secondary-hover disabled:opacity-50"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-dark transition hover:bg-accent-primary-hover disabled:opacity-50"
				>
					{#if isSubmitting}
						<span class="inline-block animate-pulse">Menyimpan...</span>
					{:else if isEditMode}
						<Save class="h-4 w-4" />
						<span>{submitLabel ?? 'Simpan Perubahan'}</span>
					{:else}
						<Plus class="h-4 w-4" />
						<span>{submitLabel ?? 'Simpan Dokumentasi'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
