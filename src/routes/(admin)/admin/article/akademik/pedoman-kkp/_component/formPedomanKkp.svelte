<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';
	import {
		folder_cloudinary_admin_article_akademik,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import { UploadCloud, ArrowLeft, Image as ImageIcon, Trash2, Save, Loader2 } from 'lucide-svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import type { PedomanKkpDTO } from '$lib/dto/admin/article/akademik';
	import type { PedomanKkpFormValues } from '$lib/types/values/admin/article';

	interface Props {
		initialData?: PedomanKkpDTO | null;
		form?: any;
		valuesData?: PedomanKkpFormValues;
		actionUrl?: string;
	}

	let { initialData = null, form = null, actionUrl = '', valuesData }: Props = $props();

	// Deteksi mode Edit vs Tambah
	const isEdit = $derived(!!initialData?.id);

	// State lokal input form
	// State lokal input form
	let title = $state(valuesData?.title ?? initialData?.title ?? '');
	let imageUrl = $state(valuesData?.image_url ?? initialData?.image_url ?? '');
	let imagePublicId = $state(valuesData?.image_public_id ?? initialData?.image_public_id ?? '');
	let description = $state(valuesData?.description ?? initialData?.description ?? '');

	let isSubmitting = $state(false);
	let isDeletingImage = $state(false);
	let showMessage = $state(false);

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, titleMsg: string, message: string) {
		messageConfig = { status, title: titleMsg, message };
		showMessage = true;
	}

	function handleUploadSuccess(result: any) {
		if (result?.event === 'success' && result?.info) {
			imageUrl = result.info.secure_url;
			imagePublicId = result.info.public_id;

			if (typeof document !== 'undefined') {
				document.body.style.overflow = 'auto';
			}
		}
	}

	async function removeImage() {
		if (!imagePublicId) {
			imageUrl = '';
			return;
		}

		isDeletingImage = true;
		const formData = new FormData();
		formData.append('public_id', imagePublicId);

		try {
			const response = await fetch('?/deletePhoto', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				imageUrl = '';
				imagePublicId = '';
				triggerMessage('success', 'Berhasil', 'Foto sampul berhasil dihapus.');
			} else {
				triggerMessage('error', 'Gagal', 'Gagal menghapus foto dari Cloudinary.');
			}
		} catch (err) {
			console.error('Error deleting photo:', err);
			triggerMessage('error', 'Kesalahan', 'Terjadi kesalahan saat menghapus foto.');
		} finally {
			isDeletingImage = false;
		}
	}
</script>

<!-- alert / toast notification -->
{#if showMessage}
	<div class="transition-all duration-300">
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

<div class="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-3">
			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-xl font-bold tracking-tight text-text-main sm:text-2xl">
						{isEdit ? 'Edit Pedoman KKP' : 'Tambah Pedoman KKP Baru'}
					</h1>
					<span
						class="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase
                        {isEdit
							? 'border border-accent-yellow/20 bg-accent-yellow/10 text-amber-400'
							: 'bg-scitech-mint/10 text-scitech-mint border-scitech-mint/20 border'}"
					>
						{isEdit ? 'Mode Edit' : 'Baru'}
					</span>
				</div>
				<p class="text-xs text-text-muted">
					{isEdit
						? 'Perbarui informasi dokumen pedoman KKP yang sudah ada.'
						: 'Kelola dan tambahkan panduan Kuliah Kerja Praktik mahasiswa.'}
				</p>
			</div>
		</div>
	</div>

	<div
		class="rounded-2xl border border-border-color/20 bg-bg-secondary/80 p-5 shadow-xl backdrop-blur-xl sm:p-8"
	>
		<form
			method="POST"
			action={actionUrl}
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						triggerMessage(
							'success',
							(result.data?.title as string) || 'Berhasil',
							(result.data?.message as string) || 'Data berhasil disimpan.'
						);
						if (!isEdit) {
							// Reset form jika tambah baru
							title = '';
							imageUrl = '';
							imagePublicId = '';
							description = '';
							await update({ reset: true });
						} else {
							await update({ reset: false });
						}
					} else if (result.type === 'failure' && result.data) {
						triggerMessage(
							'error',
							(result.data.title as string) || 'Gagal Menyimpan',
							(result.data.message as string) || 'Periksa kembali kelengkapan inputan Anda.'
						);
						await update();
					} else {
						triggerMessage(
							'error',
							'Kesalahan Sistem',
							'Terjadi kesalahan tidak terduga saat memproses data.'
						);
						await update();
					}
				};
			}}
			class="space-y-6"
		>
			{#if isEdit && initialData?.id}
				<input type="hidden" name="id" value={initialData.id} />
			{/if}

			<div class="space-y-2">
				<label for="title" class="block text-xs font-bold tracking-wider text-text-main uppercase">
					Judul Pedoman KKP <span class="text-status-error">*</span>
				</label>
				<input
					type="text"
					id="title"
					name="title"
					bind:value={title}
					placeholder="Contoh: Buku Pedoman Kuliah Kerja Praktik (KKP) Tahun 2026"
					required
					class="focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/30 bg-bg-primary/60 px-4 py-3 text-sm text-text-main transition-all placeholder:text-text-muted/50 focus:ring-2 focus:outline-none"
				/>
			</div>

			<div class="space-y-2">
				<label class="block text-xs font-bold tracking-wider text-text-main uppercase">
					Foto Sampul / Banner Pedoman
				</label>
				<input type="hidden" name="image_url" value={imageUrl} />
				<input type="hidden" name="image_public_id" value={imagePublicId} />

				{#if imageUrl}
					<div
						class="group relative max-w-md overflow-hidden rounded-2xl border border-border-color/20 bg-bg-primary/40 p-2"
					>
						<img
							src={imageUrl}
							alt="Preview Sampul Pedoman"
							class="h-48 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
						/>
						<div
							class="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
						>
							<button
								type="button"
								onclick={removeImage}
								disabled={isDeletingImage}
								class="inline-flex items-center gap-1.5 rounded-xl bg-rose-600/90 px-3.5 py-2 text-xs font-bold text-text-main shadow-lg backdrop-blur-md transition-all hover:bg-rose-500 active:scale-95 disabled:opacity-50"
							>
								{#if isDeletingImage}
									<Loader2 class="h-4 w-4 animate-spin" />
									<span>Menghapus...</span>
								{:else}
									<Trash2 class="h-4 w-4" />
									<span>Hapus Sampul</span>
								{/if}
							</button>
						</div>
					</div>
				{:else}
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
							class="hover:border-scitech-mint/50 hover:bg-scitech-mint/5 group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border-color/30 p-8 transition-all"
						>
							<div
								class="bg-scitech-mint/10 text-scitech-mint rounded-2xl p-3.5 transition-transform group-hover:scale-110"
							>
								<UploadCloud class="h-6 w-6" />
							</div>
							<div class="text-center">
								<p class="text-xs font-semibold text-text-main">
									Klik untuk memilih & mengunggah gambar sampul
								</p>
								<p class="mt-1 text-[11px] text-text-muted">
									Format yang didukung: JPG, PNG, WEBP (Rekomendasi rasio 16:9 atau 4:3)
								</p>
							</div>
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<div class="space-y-2">
				<input type="hidden" name="description" value={description} />
				<FormEditor
					showSaveButton={false}
					title="Editor Deskripsi Pedoman KKP"
					label="Deskripsi Lengkap / Ringkasan Pedoman KKP"
					bind:value={description}
				/>
			</div>

			<div class="flex items-center justify-end gap-3 border-t border-border-color/10 pt-5">
				<button
					onclick={() => history.back()}
					class="hover:bg-scitech-slate rounded-xl border border-border-color/20 px-5 py-2.5 text-xs font-semibold text-text-muted transition-all hover:text-text-main"
				>
					Batal
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="bg-scitech-mint hover:bg-scitech-mint/90 shadow-scitech-mint/20 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-text-main shadow-lg transition-all active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2 class="h-4 w-4 animate-spin" />
						<span>{isEdit ? 'Perbarui Data...' : 'Menyimpan...'}</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>{isEdit ? 'Simpan Perubahan' : 'Tambah Pedoman KKP'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
