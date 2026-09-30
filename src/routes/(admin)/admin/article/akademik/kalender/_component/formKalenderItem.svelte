<script lang="ts">
	import { enhance } from '$app/forms';
	import { CheckCircle2, Save, Trash2, UploadCloud, XCircle } from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import {
		folder_cloudinary_admin_article_akademik,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import type { AcademicCalendarWithImagesDTO } from '$lib/repository/admin/article/akedemik/kalender';
	import type { CalendarImageDTO } from '$lib/dto/admin/article/akademik';
	import Message from '$lib/components/admin/message.svelte';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message';
	import type { SubmitFunction } from '@sveltejs/kit';

	let {
		calendar,
		onDelete,
		action = '?/update',
		submitLabel = 'Update',
		isBtnActive,
    isBack = false,
	}: {
		action?: string;
		submitLabel?: string;
		calendar: AcademicCalendarWithImagesDTO;
		onDelete?: (id: string) => void;
		isBtnActive?: boolean;
    isBack? : boolean, 
	} = $props();

	// Local State
	let titleInput = $state(calendar.title || '');
	let descriptionContent = $state(calendar.description || '');
	let existingImages = $state<CalendarImageDTO[]>(calendar.images || []);

	// 1. Simpan URL beserta Public ID untuk gambar baru
	let newUploadedImages = $state<{ url: string; public_id: string }[]>([]);
	let isActive = $state(calendar?.is_active ?? true);
	let isDeletingPhoto = $state(false);

	//  Handler saat Cloudinary sukses mengunggah gambar
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url && result?.info?.public_id) {
			newUploadedImages = [
				...newUploadedImages,
				{
					url: result.info.secure_url,
					public_id: result.info.public_id
				}
			];
		}

		// Kembalikan kemampuan scroll pada document body
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'auto';
		}
	}

	// Fungsi menghapus gambar baru dari Cloudinary & State
	async function removeNewImage(index: number, publicId: string) {
		isDeletingPhoto = true;

		try {
			const formData = new FormData();
			formData.append('public_id', publicId);

			// Kirim request POST ke server action
			const response = await fetch('?/deleteImage', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				// Hapus dari state lokal
				newUploadedImages = newUploadedImages.filter((_, i) => i !== index);
				triggerMessage('success', 'Berhasil', 'Gambar berhasil dihapus');
			} else {
				triggerMessage('error', 'Gagal', 'Gagal menghapus gambar dari Cloudinary.');
			}
		} catch (err) {
			console.error('Error deleting photo:', err);
			triggerMessage('error', 'Error', 'Terjadi kesalahan saat menghapus foto.');
		} finally {
			isDeletingPhoto = false;
			// Pastikan scroll body kembali aktif
			if (typeof document !== 'undefined') {
				document.body.style.overflow = 'auto';
			}
		}
	}

	// Synchronize jika data dari server berubah
	$effect(() => {
		titleInput = calendar.title || '';
		descriptionContent = calendar.description || '';
		existingImages = calendar.images || [];
		newUploadedImages = [];
	});

	function removeExistingImage(imageId: string) {
		existingImages = existingImages.filter((img) => img.id !== imageId);
	}

	const handleFormSubmit: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				const data = result.data as any;
				triggerMessage(
					data?.status || 'success',
					data?.title || 'Berhasil',
					data?.message || 'Data berhasil disimpan.'
				);
			} else if (result.type === 'failure') {
				const data = result.data as any;
				triggerMessage(
					data?.status || 'error',
					data?.title || 'Gagal',
					data?.message || 'Terjadi kesalahan saat memproses data.'
				);
			} else if (result.type === 'error') {
				triggerMessage(
					'error',
					'Error Sistem',
					result.error.message || 'Terjadi kesalahan tidak terduga.'
				);
			}

			await update();
		};
	};

	function handleToggleStatus() {
		isActive = !isActive;
	}

	let showMessage = $state(false);

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
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

<div
	class="bg-scitech-slate/60 space-y-6 rounded-3xl border border-border-color/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
>
	<form method="POST" {action} use:enhance={handleFormSubmit} class="space-y-6">
		<!-- Hidden Inputs -->
		<input type="hidden" name="id" value={calendar.id} />
		<input type="hidden" name="description" value={descriptionContent} />
		<input type="hidden" name="is_active" value={isActive ? 'true' : 'false'} />

		<!-- Retained Image IDs (Gambar lama yang tetap dipertahankan) -->
		{#each existingImages as img}
			<input type="hidden" name="retainedImageIds" value={img.id} />
		{/each}

		<!-- Judul Kalender -->
		<div>
			<label for={`title-${calendar.id}`} class="mb-2 block text-xs font-medium text-text-muted">
				Judul Kalender*
			</label>
			<input
				id={`title-${calendar.id}`}
				name="title"
				type="text"
				required
				bind:value={titleInput}
				class="bg-bg-primary/80 focus:border-scitech-mint w-full rounded-xl border border-border-color/15 px-4 py-2.5 text-xs text-text-main focus:outline-none"
			/>
		</div>

		<!-- 1. FormEditor (Description) -->
		<div class="space-y-2">
			<label for={`desc-${calendar.id}`} class="block text-xs font-medium text-text-muted">
				Deskripsi (Form Editor)*
			</label>
			<FormEditor showSaveButton={false} bind:value={descriptionContent} />
		</div>

		<!-- 2. Grid Gambar Lama -->
		<div class="bg-scitech-navy/40 space-y-3 rounded-2xl border border-border-color/10 p-4">
			<span class="block text-xs font-medium text-text-muted">Gambar Terpasang:</span>

			{#if existingImages.length === 0}
				<p class="text-xs text-text-muted/60 italic">Belum ada gambar terpasang.</p>
			{:else}
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{#each existingImages as img, idx (img.id)}
						<div
							class="group bg-scitech-navy relative overflow-hidden rounded-xl border border-border-color/10 p-1 shadow-md"
						>
							<img
								src={img.image_url}
								alt={`Gambar ${idx + 1}`}
								class="h-32 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
							/>
							<button
								type="button"
								onclick={() => removeExistingImage(img.id)}
								class="absolute top-2 right-2 rounded-lg bg-rose-500/80 p-1.5 text-text-main opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-600"
								title="Hapus foto"
							>
								<Trash2 class="h-3.5 w-3.5" />
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="space-y-3">
			<span class="block text-xs font-medium text-text-muted">
				Upload Gambar Baru (Cloudinary)
			</span>

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
					class="bg-scitech-navy hover:bg-scitech-navy/80 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border-color/15 px-4 py-2.5 text-xs font-medium text-text-muted transition-all hover:text-text-main"
				>
					<UploadCloud class="text-scitech-mint h-4 w-4" />
					<span>Unggah Foto Sampul</span>
				</button>
			</CldUploadWidget>

			<!-- Preview Gambar Baru -->
			{#if newUploadedImages.length > 0}
				<div class="border-scitech-mint/30 bg-scitech-navy/60 space-y-2 rounded-2xl border p-3">
					<span class="text-scitech-mint text-xs font-semibold">Gambar Baru Siap Disimpan:</span>
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
						{#each newUploadedImages as item, idx (item.public_id)}
							<!-- Input hidden dikirim ke server action -->
							<input type="hidden" name="image_url" value={item.url} />
							<input type="hidden" name="image_public_id" value={item.public_id} />

							<div
								class="group border-scitech-mint/40 bg-scitech-navy relative overflow-hidden rounded-xl border p-1 shadow-md"
							>
								<img
									src={item.url}
									alt={`Gambar Baru ${idx + 1}`}
									class="h-28 w-full rounded-lg object-cover"
								/>
								<button
									type="button"
									disabled={isDeletingPhoto}
									onclick={() => removeNewImage(idx, item.public_id)}
									class="absolute top-2 right-2 rounded-lg bg-rose-500/80 p-1.5 text-text-main opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-600 disabled:opacity-50"
									title="Hapus gambar dari Cloudinary"
								>
									<Trash2 class="h-3.5 w-3.5" />
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Tombol Aksi -->
		<div class="gap-2 flex items-center justify-between pt-2">
    {#if isBack}
      
    <button
    class="bg-bg-secondary text-text-main hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95"
    onclick={() => history.back()}
    >
    Back

    </button>
    {/if}


      <button
				type="submit"
				class="bg-bg-secondary text-text-main hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95"
			>
				<Save class="h-4 w-4" />
				<span>{submitLabel}</span>
			</button>

      

			<div class="flex items-center justify-center gap-2">
				{#if isBtnActive}
					<button
						type="button"
						onclick={handleToggleStatus}
						class={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all active:scale-95 ${
							isActive
								? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
								: 'border-slate-500/30 bg-slate-500/10 text-slate-400 hover:bg-slate-500/20'
						}`}
					>
						{#if isActive}
							<CheckCircle2 class="h-4 w-4 text-emerald-400" />
							<span>Status: Aktif</span>
						{:else}
							<XCircle class="h-4 w-4 text-slate-400" />
							<span>Status: Non-Aktif</span>
						{/if}
					</button>
				{/if}
				{#if onDelete}
					<button
						type="button"
						onclick={() => onDelete(calendar.id)}
						class="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-500/20"
					>
						<Trash2 class="h-4 w-4" />
						<span>Hapus Kalender</span>
					</button>
				{/if}
			</div>
		</div>
	</form>
</div>
