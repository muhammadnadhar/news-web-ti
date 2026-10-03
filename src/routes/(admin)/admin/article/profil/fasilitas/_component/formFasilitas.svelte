<script lang="ts">
	import { CldUploadWidget } from 'svelte-cloudinary';
	import {
		folder_cloudinary_admin_article_profil,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import {
		FileText,
		Image as ImageIcon,
		Save,
		ArrowLeft,
		Loader2,
		X,
		UploadCloudIcon
	} from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import type { FacilityEntity } from '$lib/dto/admin/article/profile';
	import type { FasilitasFormValues } from '$lib/types/values/admin/article';

	interface Props {
		initialData?: (FacilityEntity & { image_public_id?: string }) | null;
		categories?: string[];
		isEditing?: boolean;
		isSubmitting?: boolean;
		actionUrl?: string;
		onCancel?: () => void;
		valuesData?: FasilitasFormValues | null;
	}

	let {
		initialData = null,
		categories = [],
		isEditing = false,
		isSubmitting = false,
		actionUrl = '',
		onCancel,
		valuesData
	}: Props = $props();

	// Form field state
	let name = $state(valuesData?.name ?? initialData?.name ?? '');
	let category = $state(valuesData?.category ?? initialData?.category ?? '');
	let brandModel = $state(valuesData?.brandModel ?? initialData?.brand_model ?? '');
	let description = $state(valuesData?.description ?? initialData?.description ?? '');

	// Cloudinary States (URL & Public ID)
	let imageUrl = $state(valuesData?.image_url ?? initialData?.image_url ?? '');
	let imagePublicId = $state(valuesData?.image_public_id ?? initialData?.image_public_id ?? '');
	let sopUrl = $state(valuesData?.sopLink ?? initialData?.sop_url ?? '');
	let isDeletingImage = $state(false);

	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	// Handler Upload Cloudinary Gambar Fasilitas
	function handleImageUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imageUrl = result.info.secure_url;
			imagePublicId = result.info.public_id; // Menyimpan public_id dari Cloudinary
		}
	}

	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	// Handler Hapus Foto via Action deletePhoto
	async function handleDeleteImage() {
		if (!imagePublicId || isDeletingImage) {
			if (!imagePublicId && imageUrl) {
				triggerMessage('error', 'Gagal', 'Public ID gambar tidak ditemukan');
			}
			return;
		}

		isDeletingImage = true;

		try {
			const formData = new FormData();
			// Mengirimkan public_id sesuai ekspektasi server action
			formData.append('image_public_id', imagePublicId);

			const endpoint = actionUrl ? `${actionUrl}?/deletePhoto` : '?/deletePhoto';
			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData,
				headers: {
					'x-sveltekit-action': 'true'
				}
			});

			if (response.ok) {
				imageUrl = '';
				imagePublicId = '';
				triggerMessage('success', 'Berhasil', 'Foto berhasil dihapus');
			} else {
				triggerMessage('error', 'Gagal', 'Gagal menghapus foto dari server');
			}
		} catch (error) {
			triggerMessage('error', 'Kesalahan', 'Terjadi kesalahan saat menghapus foto');
		} finally {
			isDeletingImage = false;
		}
	}

	// Handler Upload Cloudinary Dokumen SOP
	function handleSopUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			sopUrl = result.info.secure_url;
		}
	}

	// Ambil nama file dari URL SOP
	let sopFileName = $derived(
		sopUrl ? sopUrl.split('/').pop()?.split('?')[0] || 'Dokumen SOP Terlampir' : null
	);

	const handleSubmit: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				const data = result.data as { message?: string } | undefined;
				triggerMessage('success', 'Berhasil', data?.message || 'Data berhasil diproses');
				await update();
			} else if (result.type === 'failure') {
				const data = result.data as { message?: string } | undefined;
				triggerMessage('error', 'Gagal', data?.message || 'Gagal memproses data');
			} else if (result.type === 'error') {
				triggerMessage('error', 'Kesalahan', result.error?.message || 'Terjadi kesalahan server');
			}
		};
	};
</script>

<!-- alert / toast notification -->
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
<form
	action={actionUrl}
	method="POST"
	use:enhance={handleSubmit}
	class="mx-auto max-w-4xl space-y-6 rounded-2xl border border-border-color/10 bg-bg-secondary p-6 shadow-2xl backdrop-blur-md md:p-8"
>
	<!-- Header Form -->
	<div class="flex items-center justify-between border-b border-border-color/10 pb-4">
		<div>
			<h2 class="text-xl font-bold text-text-main sm:text-2xl">
				{isEditing ? 'Edit Fasilitas Laboratorium' : 'Tambah Fasilitas Laboratorium'}
			</h2>
			<p class="text-xs text-text-muted sm:text-sm">
				Isi formulir di bawah ini untuk {isEditing ? 'memperbarui' : 'menambahkan'} data fasilitas/alat
				lab.
			</p>
		</div>

		{#if onCancel}
			<button
				type="button"
				onclick={onCancel}
				class="flex items-center gap-1.5 rounded-xl border border-border-color/10 bg-bg-primary/5 px-3 py-2 text-xs font-medium text-text-main transition-all hover:bg-bg-primary/10"
			>
				<ArrowLeft class="h-4 w-4" />
				Kembali
			</button>
		{/if}
	</div>

	<!-- Hidden Inputs untuk ID, Image URL, & Public ID -->
	{#if isEditing && initialData?.id}
		<input type="hidden" name="id" value={initialData.id} />
	{/if}
	<input type="hidden" name="image_url" value={imageUrl} />
	<input type="hidden" name="image_public_id" value={imagePublicId} />

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- 1. Nama Fasilitas -->
		<div class="space-y-2 md:col-span-2">
			<label
				for="name"
				class="text-scitech-mint block text-xs font-semibold tracking-wider uppercase"
			>
				Nama Fasilitas / Alat <span class="text-scitech-error">*</span>
			</label>
			<input
				type="text"
				id="name"
				name="name"
				bind:value={name}
				required
				placeholder="Contoh: Mikroskop Binokuler Digital"
				class="focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/30 bg-bg-primary/60 px-4 py-3 text-sm text-text-main transition-all placeholder:text-text-muted/50 focus:ring-2 focus:outline-none"
			/>
		</div>

		<!-- 2. Kategori -->
		<div class="space-y-2">
			<label
				for="category"
				class="text-scitech-mint block text-xs font-semibold tracking-wider uppercase"
			>
				Kategori <span class="text-scitech-error">*</span>
			</label>
			<input
				type="text"
				id="category"
				name="category"
				bind:value={category}
				list="category-suggestions"
				required
				placeholder="Ketik atau pilih kategori..."
				class="focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/30 bg-bg-primary/60 px-4 py-3 text-sm text-text-main transition-all placeholder:text-text-muted/50 focus:ring-2 focus:outline-none"
			/>
			<datalist id="category-suggestions">
				{#each categories as cat}
					<option value={cat}></option>
				{/each}
			</datalist>
		</div>

		<!-- 3. Merk & Tipe -->
		<div class="space-y-2">
			<label
				for="brand_model"
				class="text-scitech-mint block text-xs font-semibold tracking-wider uppercase"
			>
				Merk & Tipe
			</label>
			<input
				type="text"
				id="brand_model"
				name="brand_model"
				bind:value={brandModel}
				placeholder="Contoh: Olympus CX23"
				class="focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/30 bg-bg-primary/60 px-4 py-3 text-sm text-text-main transition-all placeholder:text-text-muted/50 focus:ring-2 focus:outline-none"
			/>
		</div>

		<!-- Upload Gambar Fasilitas (Cloudinary Widget) -->
		<div class="space-y-2 md:col-span-2">
			<label class="text-scitech-mint block text-xs font-semibold tracking-wider uppercase">
				Gambar Fasilitas
			</label>
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
				{#if imageUrl}
					<div
						class="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-color/10 bg-black/30"
					>
						<img src={imageUrl} alt="Preview Fasilitas" class="h-full w-full object-cover" />
						<button
							type="button"
							onclick={handleDeleteImage}
							disabled={isDeletingImage}
							class="hover:bg-scitech-error absolute top-1 right-1 rounded-full bg-black/60 p-1 text-text-main transition-all disabled:opacity-50"
							title="Hapus Gambar"
						>
							{#if isDeletingImage}
								<Loader2 class="h-3.5 w-3.5 animate-spin" />
							{:else}
								<X class="h-3.5 w-3.5" />
							{/if}
						</button>
					</div>
				{:else}
					<div class="w-full flex-1">
						<CldUploadWidget
							config={getUploadConfig()}
							uploadPreset={upload_cloudinary_preset}
							options={getUploadOptions(folder_cloudinary_admin_article_profil)}
							onSuccess={handleImageUploadSuccess}
							let:open
						>
							<button
								type="button"
								onclick={() => open()}
								class="group hover:border-scitech-mint flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-color/20 bg-black/20 p-6 text-center transition-all hover:bg-black/30"
							>
								<div
									class="text-scitech-mint mb-2 rounded-full border border-border-color/10 bg-bg-primary/5 p-3 shadow-sm transition-transform group-hover:scale-110"
								>
									<UploadCloudIcon class="h-6 w-6" />
								</div>
								<span class="text-xs font-semibold text-text-main">
									{imageUrl ? 'Ganti Foto Fasilitas' : 'Unggah Foto Fasilitas'}
								</span>
								<span class="mt-1 text-[10px] text-text-muted">
									Klik untuk membuka dialog unggah gambar Cloudinary
								</span>
							</button>
						</CldUploadWidget>
					</div>
				{/if}
			</div>
		</div>

		<!-- 5. Link SOP -->
		<div class="space-y-2 md:col-span-2">
			<label class="text-scitech-mint block text-xs font-semibold tracking-wider uppercase">
				Link SOP
			</label>
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
				<input
					type="text"
					name="sop_url"
					bind:value={sopUrl}
					placeholder="Masukan Link Ke SOP"
					class="focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/30 bg-bg-primary/60 px-4 py-3 text-sm text-text-main transition-all placeholder:text-text-muted/50 focus:ring-2 focus:outline-none"
				/>
			</div>
		</div>

		<div class="space-y-2 md:col-span-2">
			<label
				for="description"
				class="text-scitech-mint block text-xs font-semibold tracking-wider uppercase"
			>
				Deskripsi Fasilitas
			</label>

			<input type="hidden" value={description} name="description" />
			<FormEditor bind:value={description} showSaveButton={false} label="Description" />
		</div>
	</div>

	<div class="flex items-center justify-end gap-3 border-t border-border-color/10 pt-4">
		{#if onCancel}
			<button
				type="button"
				onclick={onCancel}
				class="rounded-xl border border-border-color/10 bg-bg-primary/5 px-5 py-2.5 text-xs font-semibold text-text-main transition-all hover:bg-bg-primary/10"
			>
				Batal
			</button>
		{/if}

		<button
			type="submit"
			disabled={isSubmitting}
			class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint/90 flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-lg transition-all disabled:opacity-50"
		>
			{#if isSubmitting}
				<Loader2 class="h-4 w-4 animate-spin" />
				Menyimpan...
			{:else}
				<Save class="h-4 w-4" />
				{isEditing ? 'Simpan Perubahan' : 'Tambah Fasilitas'}
			{/if}
		</button>
	</div>
</form>
