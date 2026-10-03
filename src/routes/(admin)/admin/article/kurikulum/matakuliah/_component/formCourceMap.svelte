<script lang="ts">
	import { enhance, deserialize, applyAction } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import { UploadCloudIcon, Save, Plus, X, LoaderCircleIcon } from 'lucide-svelte';
	import {
		folder_cloudinary_admin_article_kurikulum,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';
	import type { CourseMapDTO } from '$lib/dto/admin/article/kurikulum';
	import type { CourseMapFormValues } from '$lib/types/values/admin/article';

	interface Props {
		initialData?: CourseMapDTO | null;
		valueData: CourseMapFormValues | undefined;
		isEditMode?: boolean;
		submitLabel?: string;
		curAction?: string;
		onCancel?: () => void;
	}

	let {
		initialData = null,
		valueData,
		isEditMode = false,
		submitLabel,
		curAction = '?/default',
		onCancel
	}: Props = $props();

	// State lokal
	let imageUrl = $state(valueData?.image_url ?? initialData?.image_url ?? '');
	let publicId = $state(valueData?.image_public_id ?? initialData?.image_public_id ?? '');
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

	// Handler saat upload sukses dari Cloudinary
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imageUrl = result.info.secure_url;
			publicId = result.info.public_id;
		}
	}

	function handleUpload(result: any) {
		if (result?.event === 'success') {
			imageUrl = result.info.secure_url;
			publicId = result.info.public_id;
		}
	}

	let isDeletingPhoto = $state(false);

	// Hapus foto jika ingin mengganti
	async function removeImage() {
		if (!imageUrl) return;

		isSubmitting = true;
		isDeletingPhoto = true;

		try {
			const body = new FormData();
			body.append('public_id', publicId);

			const res = await fetch('?/deleteImage', {
				method: 'POST',
				body,
				headers: {
					'x-sveltekit-action': 'true'
				}
			});

			const result = deserialize(await res.text());

			if (result.type === 'success') {
				imageUrl = '';
				publicId = ''; // Reset juga publicId

				triggerMessage(
					'success',
					(result.data?.title as string) || 'Berhasil',
					(result.data?.message as string) || 'Gambar berhasil dihapus dari Cloudinary.'
				);
			} else if (result.type === 'failure') {
				triggerMessage(
					'error',
					(result.data?.title as string) || 'Gagal',
					(result.data?.message as string) || 'Gagal menghapus gambar dari server.'
				);
			} else {
				triggerMessage('error', 'Error', 'Terjadi kesalahan sistem di server.');
			}
		} catch (err) {
			console.error('Error removing image:', err);
			triggerMessage('error', 'Error', 'Terjadi kesalahan koneksi.');
		} finally {
			isSubmitting = false;
			isDeletingPhoto = false;
		}
	}
</script>

<div class="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
	<header class="mb-6">
		<!-- FIX 3: Mengganti text-slate-900 dark:text-slate-100 dengan text-text-main -->
		<h1 class="text-2xl font-bold tracking-tight text-text-main">
			{isEditMode ? 'Edit Peta Mata Kuliah' : 'Tambah Peta Mata Kuliah Baru'}
		</h1>
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



	<div class="rounded-2xl border border-border-color bg-bg-secondary p-6 shadow-sm">
		<form
			method="POST"
			action={curAction}
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						triggerMessage(
							'success',
							(result?.data. title as string) || 'Berhasil',
							(result?.data.message as string) || 'Data Peta Mata Kuliah berhasil disimpan.'
						);

						if (!isEditMode) {
							imageUrl = '';
							publicId = ''; // FIX 4: Reset publicId saat menambah data baru
							await update({ reset: true });
						} else {
							await update({ reset: false });
						}
					} else if (result.type === 'redirect') {
						// FIX 5: Tangani jika backend melakukan redirect
						await applyAction(result);
					} else if (result.type === 'failure' && result.data) {
						triggerMessage(
							'error',
							(result.data.title as string) || 'Gagal Menyimpan',
							(result.data.message as string) || 'Terjadi kesalahan saat memproses form.'
						);
						await update();
					} else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan sistem saat memproses data.');
						await update();
					}
				};
			}}
			class="space-y-6"
		>
			<!-- Field: Judul Peta Mata Kuliah -->
			<div class="flex flex-col gap-2">
				<label for="title" class="text-xs font-semibold text-text-main">
					Judul Peta Mata Kuliah <span class="text-status">*</span>
				</label>
				<input
					type="text"
					id="title"
					name="title"
					value={valueData?.title ?? initialData?.title ?? ''}
					placeholder="Contoh: Peta Mata Kuliah Kurikulum Angkatan 2026 Keatas"
					required
					class="w-full rounded-xl border border-border-light bg-bg-primary px-4 py-2.5 text-sm text-text-main transition-all placeholder:text-text-muted focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 focus:outline-none"
				/>
			</div>

			<!-- Field: Upload Foto Peta Mata Kuliah -->
			<div class="flex flex-col gap-2">
				<label for="image_upload" class="text-xs font-semibold text-text-main">
					Gambar Peta Mata Kuliah <span class="text-status">*</span>
				</label>
				<input type="hidden" name="image_url" value={imageUrl} />
				<input type="hidden" name="public_id" value={publicId} />

				{#if imageUrl}
					<div
						class="relative max-w-md overflow-hidden rounded-xl border border-border-light bg-bg-primary p-3"
					>
						<img
							src={imageUrl}
							alt="Preview Peta Mata Kuliah"
							class="h-auto max-h-64 w-full rounded-lg object-contain"
						/>
						<button
							type="button"
							onclick={removeImage}
							disabled={isDeletingPhoto}
							class="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-status-error/20 bg-status-error0/10 px-3 py-2 text-xs font-semibold text-status transition-all hover:bg-status-error/20 disabled:opacity-50"
						>
							{#if isDeletingPhoto}
								<LoaderCircleIcon class="h-3.5 w-3.5 animate-spin" />
							{:else}
								<X class="h-3.5 w-3.5" />
							{/if}
							<span>Hapus & Ganti Gambar</span>
						</button>
					</div>
				{:else}
					<CldUploadWidget
						config={getUploadConfig()}
						uploadPreset={upload_cloudinary_preset}
						options={getUploadOptions(folder_cloudinary_admin_article_kurikulum)}
						onSuccess={handleUploadSuccess}
						onUpload={handleUpload}
						let:open
					>
						<button
							type="button"
							onclick={() => open()}
							class="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-color bg-bg-primary/50 p-8 text-center transition-all hover:border-accent-blue hover:bg-accent-blue-dim/40"
						>
							<div
								class="mb-2 rounded-full border border-border-light bg-bg-secondary p-3 text-text-muted shadow-sm transition-transform group-hover:scale-110 group-hover:text-accent-blue"
							>
								<UploadCloudIcon class="h-6 w-6" />
							</div>
							<span class="text-sm font-semibold text-text-main">Unggah Foto Peta Mata Kuliah</span>
							<span class="mt-1 text-xs text-text-muted"
								>Klik untuk membuka dialog unggah gambar</span
							>
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<!-- Form Actions -->
			<div class="flex items-center justify-end gap-3 border-t border-border-light pt-4">
				<button
					type="button"
					onclick={onCancel ?? (() => history.back())}
					disabled={isSubmitting}
					class="rounded-xl border border-border-light bg-bg-primary px-5 py-2.5 text-sm font-medium text-text-muted transition-all hover:bg-bg-secondary-hover hover:text-text-main disabled:opacity-50"
				>
					Batal
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 rounded-xl bg-accent-blue px-5 py-2.5 text-sm font-semibold text-text-main shadow-sm transition-all hover:bg-accent-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue disabled:opacity-50"
				>
					{#if isSubmitting}
						<LoaderCircleIcon class="h-4 w-4 animate-spin" />
						<span>Menyimpan...</span>
					{:else if isEditMode}
						<Save class="h-4 w-4" />
						<span>{submitLabel ?? 'Perbarui Peta MK'}</span>
					{:else}
						<Plus class="h-4 w-4" />
						<span>{submitLabel ?? 'Simpan Peta MK'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
