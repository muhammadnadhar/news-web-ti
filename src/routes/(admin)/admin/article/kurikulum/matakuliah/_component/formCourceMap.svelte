<script lang="ts">
	import { enhance, deserialize } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import { UploadCloudIcon, Save, Plus, X } from 'lucide-svelte';
	import {
		folder_cloudinary_admin_article_kurikulum,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';

	export interface CourseMapData {
		id?: string;
		title?: string;
		image_url?: string;
		imageUrl?: string;
	}

	interface Props {
		initialData?: CourseMapData | null;
		formError?: string | null;
		isEditMode?: boolean;
		submitLabel?: string;
		curAction?: string;
		onCancel?: () => void;
	}

	let {
		initialData = null,
		formError = null,
		isEditMode = false,
		submitLabel,
		curAction = '?/default',
		onCancel
	}: Props = $props();

	// State lokal
	let imageUrl = $state(initialData?.image_url || initialData?.imageUrl || '');
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
		}
	}

	function handleUpload(result: any) {
		if (result?.event === 'success') {
			imageUrl = result.info.secure_url;
		}
	}

	// Hapus foto jika ingin mengganti
	async function removeImage() {
		if (!imageUrl) return;

		const confirmDelete = confirm('Apakah Anda yakin ingin menghapus gambar ini dari Cloudinary?');
		if (!confirmDelete) return;

		isSubmitting = true;

		try {
			const body = new FormData();
			body.append('image_url', imageUrl);

			// Panggil action dengan header 'x-sveltekit-action'
			const res = await fetch('?/deleteImage', {
				method: 'POST',
				body,
				headers: {
					'x-sveltekit-action': 'true'
				}
			});

			// Deserialize response dari SvelteKit Form Action
			const result = deserialize(await res.text());

			if (result.type === 'success' && result.data?.success) {
				imageUrl = ''; // Kosongkan preview gambar di UI
				triggerMessage(
					'success',
					(result.data.title as string) || 'Berhasil',
					(result.data.message as string) || 'Gambar berhasil dihapus dari Cloudinary.'
				);
			} else if (result.type === 'failure' && result.data) {
				triggerMessage(
					'error',
					(result.data.title as string) || 'Gagal',
					(result.data.message as string) || 'Gagal menghapus gambar dari server.'
				);
			} else {
				triggerMessage('error', 'Error', 'Terjadi kesalahan sistem di server.');
			}
		} catch (err) {
			console.error('Error removing image:', err);
			triggerMessage('error', 'Error', 'Terjadi kesalahan koneksi.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
	<header class="mb-6">
		<h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
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

	<!-- Notifikasi Error dari Server Form -->
	{#if formError}
		<div class="mb-6">
			<Message status="error" title="Gagal" message={formError} dismissible={true} />
		</div>
	{/if}

	<!-- Card Container -->
	<div class="rounded-2xl border border-border-color bg-bg-secondary p-6 shadow-sm">
		<form
			method="POST"
			action={curAction}
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success' && result.data?.success) {
						triggerMessage(
							'success',
							(result.data.title as string) || 'Berhasil',
							(result.data.message as string) || 'Data Peta Mata Kuliah berhasil disimpan.'
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
				<label for="title" class="text-sm font-medium text-text-main">
					Judul Peta Mata Kuliah <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="title"
					name="title"
					value={initialData?.title || ''}
					placeholder="Contoh: Peta Mata Kuliah Kurikulum Angkatan 2026 Keatas"
					required
					class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
				/>
			</div>

			<!-- Field: Upload Foto Peta Mata Kuliah -->
			<div class="flex flex-col gap-2">
				<label for="image_upload" class="text-sm font-medium text-slate-700 dark:text-slate-200">
					Gambar Peta Mata Kuliah <span class="text-red-500">*</span>
				</label>
				<input type="hidden" name="image_url" value={imageUrl} />

				{#if imageUrl}
					<div
						class="relative max-w-md overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50"
					>
						<img
							src={imageUrl}
							alt="Preview Peta Mata Kuliah"
							class="h-auto max-h-64 w-full rounded-lg object-contain"
						/>
						<button
							type="button"
							onclick={removeImage}
							class="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50"
						>
							<X class="h-4 w-4" />
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
							class="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-all hover:border-indigo-500 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-indigo-400 dark:hover:bg-slate-800"
						>
							<div
								class="mb-2 rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition-transform group-hover:scale-110 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
							>
								<UploadCloudIcon class="h-6 w-6" />
							</div>
							<span class="text-sm font-semibold text-slate-700 dark:text-slate-200"
								>Unggah Foto Peta Mata Kuliah</span
							>
							<span class="mt-1 text-xs text-slate-500 dark:text-slate-400"
								>Klik untuk membuka dialog unggah gambar</span
							>
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<!-- Form Actions -->
			<div
				class="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800"
			>
				<button
					type="button"
					onclick={onCancel ?? (() => history.back())}
					disabled={isSubmitting}
					class="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Batal
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-text-main shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
				>
					{#if isSubmitting}
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
