<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import Message from '$lib/components/admin/message.svelte';
	import { removeLastPath } from '$lib/utils';
	import type { ActionData } from './$types';
	import type { ResponseMessage } from '$lib/types/message';
	import {
		ArrowLeft,
		Building2,
		ImagePlus,
		Trash2,
		Save,
		Loader2Icon,
		FileText,
		Sparkles,
		UploadCloud,
		BookDashedIcon
	} from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import {
		upload_cloudinary_preset,
		folder_cloudinary_admin_article_profil,
		getUploadConfig,
		getUploadOptions
	} from '$lib/cloudinary/client';

	let { form }: { form: ActionData } = $props();

	let imageUrl = $state(form?.values?.image_url || '');
	let description = $state(form?.values?.description || '');
	let editorRef = $state<any>(null);
	let isSubmitting = $state(false);

	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imageUrl = result.info.secure_url;
		}
	}

	function removeImage() {
		imageUrl = '';
	}
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<!-- Header & Navigation Bar -->
	<div class="flex items-center justify-between border-b border-white/10 pb-4">
		<div class="flex items-center gap-3">
			<div>
				<div class="flex items-center gap-2">
					<Building2 class="text-scitech-mint h-5 w-5" />
					<h1 class="text-scitech-mint text-lg font-bold tracking-wide sm:text-xl">
						Tambah Struktur Organisasi
					</h1>
				</div>
				<p class="text-xs text-text-muted">
					Lengkapi informasi judul, bagan bagan organisasi, dan deskripsi struktur.
				</p>
			</div>
		</div>
	</div>

	<!-- Alert / Toast Message Component -->
	{#if showMessage || form?.message}
		<Message
			status={showMessage ? messageConfig.status : 'error'}
			title={showMessage ? messageConfig.title : 'Gagal'}
			message={showMessage ? messageConfig.message : form?.message || ''}
			dismissible={true}
			timeout={5000}
			onclose={() => (showMessage = false)}
		/>
	{/if}

	<!-- Glassmorphism Card Form Container -->
	<div
		class="bg-scitech-slate/50 rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				// Sync data dari FormEditor sebelum submit
				if (editorRef?.triggerSave) {
					description = editorRef.triggerSave();
				}

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'success',
							title: 'Berhasil',
							message: 'Struktur organisasi berhasil disimpan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						await update({ reset: true });
						imageUrl = '';
						description = '';
					} else if (result.type === 'failure') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'error',
							title: 'Gagal',
							message: (result.data?.message as string) || 'Gagal menyimpan data.'
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
			<!-- Field 1: Judul Struktur Organisasi -->
			<div class="space-y-2">
				<label for="title" class="flex items-center gap-2 text-xs font-semibold text-text-main">
					<FileText class="text-scitech-cyan h-4 w-4" />
					<span>Judul Struktur Organisasi</span>
					<span class="text-red-400">*</span>
				</label>

				<input
					type="text"
					id="title"
					name="title"
					value={form?.values?.title || ''}
					placeholder="Contoh: Struktur Organisasi Program Studi Teknologi Informasi"
					required
					disabled={isSubmitting}
					class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-white/10 px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:ring-2 focus:outline-none disabled:opacity-50"
				/>
			</div>

			<!-- Field 2: Upload Gambar Bagan Struktur Organisasi -->
			<div class="space-y-2">
				<label
					for="image_upload"
					class="flex items-center gap-2 text-xs font-semibold text-text-main"
				>
					<ImagePlus class="text-scitech-cyan h-4 w-4" />
					<span>Bagan / Gambar Struktur Organisasi</span>
				</label>

				<!-- Hidden Input untuk dikirim via form server -->
				<input type="hidden" name="image_url" value={imageUrl} />

				{#if imageUrl}
					<!-- Preview Gambar Terunggah -->
					<div class="relative overflow-hidden rounded-xl border border-white/10 bg-black/30 p-3">
						<div
							class="group relative flex max-h-80 items-center justify-center overflow-hidden rounded-lg bg-black/40"
						>
							<img
								src={imageUrl}
								alt="Preview Bagan Struktur Organisasi"
								class="max-h-80 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
							/>
						</div>

						<div class="mt-3 flex items-center justify-between">
							<span class="max-w-[70%] truncate text-[11px] text-text-muted">
								{imageUrl}
							</span>
							<button
								type="button"
								onclick={removeImage}
								disabled={isSubmitting}
								class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 active:scale-95 disabled:opacity-50"
							>
								<Trash2 class="h-3.5 w-3.5" />
								<span>Hapus Gambar</span>
							</button>
						</div>
					</div>
				{:else}
					<!-- Dropzone / Button Upload Cloudinary -->
					<CldUploadWidget
						config={getUploadConfig()}
						options={getUploadOptions(folder_cloudinary_admin_article_profil)}
						uploadPreset={upload_cloudinary_preset}
						onSuccess={handleUploadSuccess}
						let:open
					>
						<button
							type="button"
							onclick={() => open()}
							disabled={isSubmitting}
							class="hover:border-scitech-mint/50 group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 bg-black/20 p-8 transition-all hover:bg-white/5 active:scale-[0.99] disabled:opacity-50"
						>
							<div
								class="group-hover:bg-scitech-mint/20 text-scitech-mint rounded-full bg-white/5 p-3 transition-all group-hover:scale-110"
							>
								<UploadCloud class="h-6 w-6" />
							</div>
							<div class="text-center">
								<p
									class="group-hover:text-scitech-mint text-xs font-semibold text-text-main transition-colors"
								>
									Unggah Gambar Bagan Organisasi
								</p>
								<p class="mt-1 text-[11px] text-text-muted">
									Format disarankan: PNG, JPG, WEBP (Max 5MB via Cloudinary)
								</p>
							</div>
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<!-- field 3: deskripsi organisasi (formeditor component) -->
			<div class="space-y-2">
				<label for="editor" class="flex items-center gap-2 text-xs font-semibold text-text-main">
					<BookDashedIcon />
					<span>Deskripsi / Penjelasan Struktur Organisasi</span>
				</label>

				<!-- hidden input untuk dikirim via form server -->
				<input type="hidden" name="description" value={description} />

				<FormEditor
					title="Editor Deskripsi Organisasi"
					label="Penjelasan / Rincian Tugas Struktur Organisasi"
					bind:this={editorRef}
					showSaveButton={false}
					bind:value={description}
				/>
			</div>

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
						<span>Menyimpan...</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>Simpan Struktur Organisasi</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
