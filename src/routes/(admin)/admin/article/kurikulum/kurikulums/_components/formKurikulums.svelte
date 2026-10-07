<script lang="ts">
	import { enhance } from '$app/forms';
	import { BookOpen, LoaderCircle, Save, Trash2, UploadCloud } from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import {
		folder_cloudinary_admin_article_akademik,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import Message from '$lib/components/admin/message.svelte';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { CurriculumDTO } from '$lib/dto/admin/article/kurikulum';
	import type { kurikulumsFormValues } from '$lib/types/values/admin/article';
	import type { ImageItem } from '$lib/dto/admin/home';

	let {
		initialData,
		onDelete,
		action = '?/create',
		submitLabel = 'Simpan Kurikulum',
		valuesData,
		isBack = false
	}: {
		action?: string;
		submitLabel?: string;
		initialData?: CurriculumDTO | null;
		onDelete?: (id: string) => void;
		valuesData?: kurikulumsFormValues;
		isBack?: boolean;
	} = $props();

	let isSubmitting = $state(false);

	// Local State
	let descriptionContent = $state(valuesData?.description ?? initialData?.description ?? '');

	// Gabungkan gambar yang sudah ada dengan gambar baru dari values/props
	let imagesList = $state<ImageItem[]>(valuesData?.images ?? initialData?.images ?? []);

	let isDeletingPhoto = $state(false);

	// Handler saat Cloudinary sukses mengunggah gambar
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imagesList = [
				...imagesList,
				{
					url: result.info.secure_url,
					public_id: result.info.public_id,
					caption: ''
				}
			];
		}

		// Kembalikan kemampuan scroll pada document body
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'auto';
		}
	}

	// Fungsi menghapus gambar dari list lokal & Cloudinary berdasarkan index
	async function removeImage(index: number) {
		const targetImage = imagesList[index];

		// Ambil public_id (mendukung struktur objek { url, public_id } atau string URL langsung)
		const publicId = targetImage?.public_id || targetImage;

		// Jika gambar belum di-upload ke Cloudinary (misal masih preview lokal/blob), hapus lokal saja
		if (
			!publicId ||
			typeof publicId !== 'string' ||
			publicId.startsWith('blob:') ||
			publicId.startsWith('data:')
		) {
			imagesList = imagesList.filter((_, i) => i !== index);
			return;
		}

		isDeletingPhoto = true;

		try {
			const formData = new FormData();
			formData.append('public_id', publicId);

			// Panggil named action SvelteKit '?/deletePhoto'
			const response = await fetch('?/deletePhoto', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				// Hapus dari array state lokal setelah sukses di server
				imagesList = imagesList.filter((_, i) => i !== index);

				// Jika fungsi triggerMessage tersedia di komponen Anda
				if (typeof triggerMessage === 'function') {
					triggerMessage('success', 'Berhasil', 'Berhasil menghapus gambar dari Cloudinary');
				}
			} else {
				if (typeof triggerMessage === 'function') {
					triggerMessage('error', 'Gagal', 'Gagal menghapus gambar dari Cloudinary');
				}
			}
		} catch (err) {
			console.error('Error deleting photo:', err);
		} finally {
			isDeletingPhoto = false;
		}
	}

	// Synchronize jika data dari server berubah
	$effect(() => {
		if (initialData) {
			descriptionContent = initialData.description || '';
			imagesList = initialData.images || [];
		}
	});

	const handleFormSubmit: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				const data = result.data as any;
				triggerMessage(
					data?.status || 'success',
					data?.title || 'Berhasil',
					data?.message || 'Data kurikulum berhasil disimpan.'
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
	class="space-y-6 rounded-3xl border border-border-color/10 bg-bg-secondary/60 p-6 shadow-2xl sm:p-8"
>
	<form method="POST" {action} use:enhance={handleFormSubmit} class="space-y-6">
		{#if initialData?.id}
			<input type="hidden" name="id" value={initialData.id} />
		{/if}

		<input type="hidden" name="images_json" value={JSON.stringify(imagesList)} />

		<div class="space-y-2">
			<label for="name" class="block text-xs font-medium text-text-muted">
				Judul / Tipe Kurikulum *
			</label>
			<div class="relative">
				<div
					class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted/40"
				>
					<BookOpen class="h-4 w-4" />
				</div>
				<input
					type="text"
					id="title"
					name="title"
					value={valuesData?.title ?? initialData?.title ?? ''}
					placeholder="Contoh: OBE"
					required
					class="w-full rounded-xl border border-border-color bg-bg-primary/60 py-3 pr-4 pl-10 text-sm font-medium text-slate-800 transition-all placeholder:font-normal placeholder:text-text-muted/40 focus:border-slate-900 focus:bg-bg-secondary focus:ring-2 focus:ring-slate-900 focus:outline-none disabled:opacity-50"
				/>
			</div>
		</div>

		<!-- Input Deskripsi -->
		<div class="space-y-2">
			<label for="description" class="block text-xs font-medium text-text-muted">
				Deskripsi Kurikulum *
			</label>
			<FormEditor showSaveButton={false} bind:value={descriptionContent} />
			<input type="hidden" name="description" value={descriptionContent} />
		</div>

		<!-- Daftar Gambar Kurikulum -->
		<div class="bg-scitech-navy/40 space-y-3 rounded-2xl border border-border-color/10 p-4">
			<span class="block text-xs font-medium text-text-muted">Daftar Gambar Kurikulum:</span>

			{#if imagesList.length === 0}
				<p class="text-xs text-text-muted/60 italic">Belum ada gambar yang diunggah.</p>
			{:else}
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{#each imagesList as img, idx (img.url + idx)}
						<div
							class="group bg-scitech-navy relative overflow-hidden rounded-xl border border-border-color/10 p-1 shadow-md"
						>
							<img
								src={img.url}
								alt={`Gambar Kurikulum ${idx + 1}`}
								class="h-32 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
							/>
							<button
								type="button"
								onclick={() => removeImage(idx)}
								class="absolute top-2 right-2 rounded-lg bg-status-error/80 p-1.5 text-text-main opacity-0 transition-opacity group-hover:opacity-100 hover:bg-status-error/60"
								title="Hapus foto"
							>
								{#if isDeletingPhoto}
									<LoaderCircle class="h-4 w-4 animate-spin" />
								{:else}
									<Trash2 class="h-3.5 w-3.5" />
								{/if}
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Tombol Upload Cloudinary -->
		<div class="space-y-3">
			<span class="block text-xs font-medium text-text-muted">
				Tambah Gambar Baru (Cloudinary)
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
					<span>Unggah Gambar Baru</span>
				</button>
			</CldUploadWidget>
		</div>

		<!-- Tombol Aksi (Back, Save, Delete) -->
		<div class="flex items-center justify-between gap-2 pt-2">
			<div class="flex items-center gap-2">
				{#if isBack}
					<button
						type="button"
						class="inline-flex items-center gap-2 rounded-xl bg-bg-secondary px-6 py-2.5 text-xs font-bold text-text-main shadow-lg transition-all hover:bg-bg-secondary-hover active:scale-95"
						onclick={() => history.back()}
					>
						Back
					</button>
				{/if}

				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 rounded-xl bg-bg-secondary px-6 py-2.5 text-xs font-bold text-text-main shadow-lg transition-all hover:bg-bg-secondary-hover active:scale-95 disabled:opacity-50"
				>
					<Save class="h-4 w-4" />
					<span>{submitLabel}</span>
				</button>
			</div>

			<div>
				{#if onDelete && initialData?.id}
					<button
						type="button"
						onclick={() => onDelete(initialData.id)}
						class="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-500/20"
					>
						<Trash2 class="h-4 w-4" />
						<span>Hapus Kurikulum</span>
					</button>
				{/if}
			</div>
		</div>
	</form>
</div>
