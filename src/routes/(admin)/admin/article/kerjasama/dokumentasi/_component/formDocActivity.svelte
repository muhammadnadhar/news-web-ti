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
	let imageUrl = $state(initialData?.image_url || '');
	let isSubmitting = $state(false);
	let showMessage = $state(false);

	let messageConfig = $state<{
		status: MessageStatus;
		title: string;
		message: string;
	}>({
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

	// Hapus foto
	function removeImage() {
		imageUrl = '';
	}
</script>

<div class="container">
	<header class="header">
		<h1>{isEditMode ? 'Edit Dokumentasi Kegiatan' : 'Tambah Dokumentasi Kegiatan Baru'}</h1>
	</header>

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

	<div class="card">
		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success' && result.data?.success) {
						triggerMessage(
							'success',
							(result.data.title as string) || 'Berhasil',
							result.data.message as string
						);

						if (!isEditMode) {
							imageUrl = '';
							await update({ reset: true });
						} else {
							await update({ reset: false });
						}
					} else if (result.type === 'failure' && result.data) {
						triggerMessage(
							'error',
							(result.data.title as string) || 'Gagal Menyimpan',
							result.data.message as string
						);
						await update();
					} else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan sistem saat memproses data.');
						await update();
					}
				};
			}}
			class="form"
		>
			<!-- Field: Judul Kegiatan -->
			<div class="form-group">
				<label for="title">Judul Kegiatan / Nama Dokumentasi <span class="required">*</span></label>
				<input
					type="text"
					id="title"
					name="title"
					defaultValue={initialData?.title || ''}
					placeholder="Contoh: Workshop Pemrograman SvelteKit 2026"
					required
				/>
			</div>

			<!-- Field: Tanggal Pelaksanaan -->
			<div class="form-group">
				<label for="event_date">Tanggal Pelaksanaan Kegiatan</label>
				<input
					type="date"
					id="event_date"
					name="event_date"
					defaultValue={formatDateForInput(initialData?.event_date)}
				/>
			</div>

			<!-- Field: Upload Foto Media Dokumentasi Cloudinary -->
			<div class="form-group">
				<label for="image_upload">Foto / Media Dokumentasi <span class="required">*</span></label>
				<input type="hidden" name="image_url" value={imageUrl} required />

				{#if imageUrl}
					<div class="image-preview">
						<img src={imageUrl} alt="Preview Dokumentasi" />
						<button type="button" class="btn-remove-img" onclick={removeImage}>
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
						<button type="button" class="btn-upload" onclick={() => open()}>
							<ImageIcon /> Unggah Foto Dokumentasi
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<!-- Field: Deskripsi Singkat Kegiatan -->
			<div class="form-group">
				<label for="description">Deskripsi Singkat Kegiatan</label>
				<textarea
					id="description"
					name="description"
					rows="4"
					placeholder="Tuliskan deskripsi ringkas mengenai pelaksanaan kegiatan ini..."
					defaultValue={initialData?.description || ''}></textarea>
			</div>

			<!-- Form Actions -->
			<div class="form-actions">
				<button
					type="button"
					onclick={onCancel ?? (() => history.back())}
					class="btn-cancel"
					disabled={isSubmitting}
				>
					Batal
				</button>
				<button type="submit" class="btn-save" disabled={isSubmitting}>
					{#if isSubmitting}
						<span>Menyimpan...</span>
					{:else if isEditMode}
						<Save class="mr-1 inline h-4 w-4" />
						<span>{submitLabel ?? 'Simpan Perubahan'}</span>
					{:else}
						<Plus class="mr-1 inline h-4 w-4" />
						<span>{submitLabel ?? 'Simpan Dokumentasi'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
