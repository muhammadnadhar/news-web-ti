<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import { UploadCloud, X, ArrowLeft, Save, Loader2, Trash2, LoaderCircle } from 'lucide-svelte';
	import {
		folder_cloudinary_admin_article_akademik,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import type { ResponseMessage } from '$lib/types/message';

	// Props interface
	interface Props {
		initialData?: {
			id?: number | string;
			title?: string;
			imageUrl?: string;
			description?: string;
		};
		action?: string;
		isEdit?: boolean;
		submitButtonText?: string;
	}

	let {
		initialData = {},
		isEdit = false,
		action,
		submitButtonText = isEdit ? 'Perbarui Data' : 'Simpan Rekrutmen'
	}: Props = $props();

	// Reactive States
	let title = $state(initialData?.title || '');
	let imageUrl = $state(initialData?.imageUrl || '');
	let description = $state(initialData?.description || '');
	let isSubmitting = $state(false);

	let photoPublicId = $state(''); // Simpan public_id dari Cloudinary
	let isDeletingPhoto = $state(false);
	let showMessage = $state(false);

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	let messageState = $state<ResponseMessage>({
		type: 'succes',
		title: '',
		message: ''
	});

	// Handlers
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imageUrl = result.info.secure_url;
		}
		// Pulihkan scroll body yang terkunci oleh Cloudinary
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'auto';
		}
	}

	// Fungsi untuk menghapus foto dari Cloudinary & mereset state
	async function removeImage() {
		if (!photoPublicId) {
			imageUrl = '';
			return;
		}

		isDeletingPhoto = true;

		try {
			const formData = new FormData();
			formData.append('public_id', photoPublicId);

			// Panggil named action '?/deletePhoto'
			const response = await fetch('?/deletePhoto', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				imageUrl = '';
				photoPublicId = '';
			} else {
				alert('Gagal menghapus gambar dari Cloudinary');
			}
		} catch (err) {
			console.error('Error deleting photo:', err);
		} finally {
			isDeletingPhoto = false;
		}
	}
	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}
</script>

<!-- Message Helper Component -->
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

<div class="mx-auto w-full max-w-5xl space-y-6">
	<!-- Form Card 3D Neobrutalist -->
	<div class="border border-border-light bg-bg-secondary p-6 md:p-8">
		<form
			{action}
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if ((result.type === 'success' || result.type === 'failure') && result.data?.message) {
						const msg = result.data.message as {
							title?: string;
							message?: string;
							type?: 'success' | 'error';
						};
						showMessage = true;
						messageState = {
							type: msg.type || (result.type === 'success' ? 'success' : 'error'),
							title: msg.title || (result.type === 'success' ? 'Berhasil' : 'Gagal'),
							message: msg.message || ''
						};
					} else if (result.type === 'error') {
						showMessage = true;

						messageState = {
							type: 'error',
							title: 'Terjadi Kesalahan',
							message: 'Gagal memperbarui data pada server.'
						};
					}

					await update();
				};
			}}
			class="space-y-6"
		>
			<!-- Field 1: Judul -->
			<div class="space-y-2">
				<label for="title" class="block text-sm font-bold text-text-main">
					Judul / Ketentuan Rekrutmen <span class="text-status-error">*</span>
				</label>
				<input
					type="text"
					id="title"
					name="title"
					bind:value={title}
					placeholder="Contoh: Open Recruitment Asisten Laboratorium TI Semester Ganjil 2026/2027"
					required
					class="w-full border border-border-light bg-bg-primary p-3 text-sm font-medium text-text-main placeholder-text-muted shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-accent-primary focus:outline-none"
				/>
			</div>

			<!-- Field 2: Upload Gambar -->
			<div class="space-y-2">
				<label for="image_upload" class="block text-sm font-bold text-text-main">
					Poster / Foto Pendukung
				</label>
				<input type="hidden" name="image_url" value={imageUrl} />

				{#if imageUrl}
					<div
						class="relative inline-block border border-border-light bg-bg-primary p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
					>
						<img
							src={imageUrl}
							alt="Preview Poster"
							class="max-h-72 w-auto border border-border-light object-contain"
						/>
						<button
							type="button"
							onclick={removeImage}
							class="mt-3 inline-flex items-center gap-1.5 border border-status-error/40 bg-status-error/10 px-3 py-1.5 text-xs font-bold text-status-error shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:bg-status-error/20 active:scale-95"
						>
							<Trash2 class="h-3.5 w-3.5" />
							{#if isDeletingPhoto}
								<LoaderCircle class="h-4 w-4 animate-spin" />
							{:else}
								<span>Hapus Foto</span>
							{/if}
						</button>
					</div>
				{:else}
					<div>
						<CldUploadWidget
							config={getUploadConfig()}
							options={getUploadOptions(folder_cloudinary_admin_article_akademik)}
							uploadPreset={upload_cloudinary_preset}
							onSuccess={handleUploadSuccess}
							let:open
						>
							<button
								type="button"
								onclick={() => open()}
								class="inline-flex items-center gap-2 border border-border-light bg-bg-primary px-4 py-2.5 text-xs font-bold text-text-main shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:bg-bg-primary/80 active:scale-95"
							>
								<UploadCloud class="h-4 w-4 text-accent-cyan" />
								<span>Unggah Poster / Gambar </span>
							</button>
						</CldUploadWidget>
					</div>
				{/if}
			</div>

			<!-- Field 3: Form Editor Deskripsi -->
			<div class="space-y-2">
				<input type="hidden" name="description" value={description} />
				<FormEditor
					title="Editor Ketentuan Rekrutmen"
					label="Deskripsi / Syarat & Ketentuan Rekrutmen"
					bind:value={description}
					showSaveButton={false}
				/>
			</div>

			<!-- Actions -->
			<div class="flex flex-wrap items-center justify-end gap-3 border-t border-border-light pt-4">
				<!-- <a -->
				<!-- 	href={backUrl} -->
				<!-- 	class="inline-flex items-center justify-center border border-border-light bg-bg-primary px-5 py-2.5 text-sm font-bold text-text-main shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:bg-bg-primary/80 active:scale-95" -->
				<!-- > -->
				<!-- 	Batal -->
				<!-- </a> -->
				<button
					type="button"
					onclick={() => history.back()}
					disabled={isSubmitting}
					class="rounded-xl border-2 px-5 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-white/10 hover:text-text-main active:scale-95 disabled:opacity-50"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 border border-border-light bg-accent-primary px-6 py-2.5 text-sm font-bold text-text-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-accent-primary-hover active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2 class="h-4 w-4 animate-spin" />
						<span>Menyimpan...</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>{submitButtonText}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
