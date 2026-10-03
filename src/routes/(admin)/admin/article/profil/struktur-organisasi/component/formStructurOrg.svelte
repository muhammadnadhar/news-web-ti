<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import Message from '$lib/components/admin/message.svelte';
	import { removeLastPath } from '$lib/utils';
	import type { ActionData } from '.././$types';
	import type { ResponseMessage } from '$lib/types/message';
	import {
		Building2,
		ImagePlus,
		Trash2,
		Save,
		Loader2Icon,
		FileText,
		UploadCloud,
		BookDashedIcon,
		LoaderCircle,
		X
	} from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import {
		upload_cloudinary_preset,
		folder_cloudinary_admin_article_profil,
		getUploadConfig,
		getUploadOptions
	} from '$lib/cloudinary/client';
	import type { OrgStructureFormValues } from '$lib/types/values/admin/article';
	import type { OrgStructureItemDTO } from '$lib/dto/admin/article/profile';

	let {
		isEdit = false,
		actionUrl = isEdit ? '?/update' : '?/create',
		initialData = null,
		valuesData
	}: {
		isEdit?: boolean;
		actionUrl?: string;
		initialData?: OrgStructureItemDTO | null;
		valuesData: OrgStructureFormValues | null;
		form?: ActionData | null;
	} = $props();

	// State diinisialisasi berdasarkan data dari form (jika error) atau initialData
	let title = $state(valuesData?.title ?? initialData?.title ?? '');
	let imageUrl = $state(valuesData?.image_url ?? initialData?.image_url ?? '');
	let photoPublicId = $state(valuesData?.image_public_id ?? initialData?.image_public_id ?? '');
	let description = $state(valuesData?.description ?? initialData?.description ?? '');

	let editorRef = $state<any>(null);
	let isSubmitting = $state(false);
	let isDeletingPhoto = $state(false);

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
			photoPublicId = result.info.public_id;
		}
	}

	async function removePhoto() {
		if (!photoPublicId) {
			imageUrl = '';
			return;
		}

		isDeletingPhoto = true;

		try {
			const formData = new FormData();
			formData.append('public_id', photoPublicId);

			const response = await fetch('?/deletePhoto', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				imageUrl = '';
				photoPublicId = '';
				triggerMessage('success', 'Berhasil', 'Gambar berhasil dihapus dari Cloudinary.');
			} else {
				triggerMessage('error', 'Gagal', 'Gagal menghapus gambar dari Cloudinary.');
			}
		} catch (err) {
			console.error('Error deleting photo:', err);
			triggerMessage('error', 'Error', 'Terjadi kesalahan koneksi saat menghapus gambar.');
		} finally {
			isDeletingPhoto = false;
		}
	}
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<div class="flex items-center justify-between pb-4">
		<div class="flex items-center gap-3">
			<div>
				<div class="flex items-center gap-2">
					<Building2 class="text-scitech-mint h-5 w-5" />
					<h1 class="text-scitech-mint text-lg font-bold tracking-wide sm:text-xl">
						{isEdit ? 'Edit Struktur Organisasi' : 'Tambah Struktur Organisasi'}
					</h1>
				</div>
				<p class="text-xs text-text-muted">
					{isEdit
						? 'Perbarui informasi judul, bagan organisasi, dan deskripsi struktur.'
						: 'Lengkapi informasi judul, bagan organisasi, dan deskripsi struktur.'}
				</p>
			</div>
		</div>
	</div>

	<!-- Alert / Toast Message Component -->
	{#if showMessage}
		<Message
			status={messageConfig.status}
			title={messageConfig.title}
			message={messageConfig.message}
			dismissible={true}
			timeout={5000}
			onclose={() => (showMessage = false)}
		/>
	{/if}

	<!-- Glassmorphism Card Form Container -->
	<div
		class="rounded-2xl border border-white/10 bg-bg-secondary/50 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<form
			method="POST"
			action={actionUrl}
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				if (editorRef?.triggerSave) {
					description = editorRef.triggerSave();
				}

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						const resData = (result?.data as ResponseMessage) ?? {
							status: 'success',
							title: 'Berhasil',
							message: isEdit
								? 'Struktur organisasi berhasil diperbarui.'
								: 'Struktur organisasi berhasil disimpan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);

						if (!isEdit) {
							await update({ reset: true });
							imageUrl = '';
							photoPublicId = '';
							description = '';
							title = '';
						} else {
							await update({ reset: false });
						}
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
			<!-- Hidden Input untuk Cloudinary -->
			<input type="hidden" name="image_url" value={imageUrl} />
			<input type="hidden" name="image_public_id" value={photoPublicId} />

			<!-- Field 1: Judul -->
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
					bind:value={title}
					placeholder="Contoh: Struktur Organisasi Program Studi Teknologi Informasi"
					required
					disabled={isSubmitting}
					class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/10 px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:ring-2 focus:outline-none disabled:opacity-50"
				/>
			</div>

			<!-- Field 2: Upload Gambar -->
			<div class="space-y-2">
				<label
					for="image_upload"
					class="flex items-center gap-2 text-xs font-semibold text-text-main"
				>
					<ImagePlus class="text-scitech-cyan h-4 w-4" />
					<span>Bagan / Gambar Struktur Organisasi</span>
				</label>

				{#if imageUrl}
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
								onclick={removePhoto}
								disabled={isDeletingPhoto}
								class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 active:scale-95 disabled:opacity-50"
							>
								{#if isDeletingPhoto}
									<LoaderCircle class="h-4 w-4 animate-spin" />
								{:else}
									<Trash2 class="h-3.5 w-3.5" />
									<span>Hapus</span>
								{/if}
							</button>
						</div>
					</div>
				{:else}
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
								class="text-scitech-mint rounded-full bg-white/5 p-3 transition-all group-hover:scale-110 group-hover:bg-bg-secondary/20"
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

			<!-- Field 3: Deskripsi -->
			<div class="space-y-2">
				<label for="editor" class="flex items-center gap-2 text-xs font-semibold text-text-main">
					<BookDashedIcon class="h-4 w-4" />
					<span>Deskripsi / Penjelasan Struktur Organisasi</span>
				</label>

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
					onclick={() => history.back()}
					disabled={isSubmitting}
					class="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-white/10 hover:text-text-main active:scale-95 disabled:opacity-50"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="text-scitech-navy shadow-scitech-mint/10 inline-flex items-center gap-2 rounded-xl bg-bg-secondary px-6 py-2.5 text-xs font-bold shadow-md transition-all hover:bg-bg-secondary-hover active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2Icon class="h-4 w-4 animate-spin" />
						<span>{isEdit ? 'Memperbarui...' : 'Menyimpan...'}</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>{isEdit ? 'Perbarui Struktur Organisasi' : 'Simpan Struktur Organisasi'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
